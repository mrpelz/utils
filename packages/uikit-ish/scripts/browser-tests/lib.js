/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

// Headless browser test tooling: builds the demo, serves it, and drives
// headless Chrome via the Chrome DevTools Protocol (CDP), without
// dependencies beyond Node and Chrome.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

export { setTimeout as sleep } from 'node:timers/promises';

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const DEVTOOLS_URL = /DevTools listening on (?<url>ws:\/\/\S+)/u;

const MIME_TYPES = /** @type {Record<string, string>} */ ({
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.map': 'application/json',
  '.png': 'image/png',
});

/**
 * Builds the demo with webpack (development mode) into a temporary directory.
 *
 * @param {string} packageDirectory
 * @returns {Promise<string>} the output directory
 */
export const buildDemo = async (packageDirectory) => {
  const outputPath = await mkdtemp(path.join(tmpdir(), 'uikit-ish-demo-'));

  await new Promise((resolvePromise, rejectPromise) => {
    const webpack = spawn(
      'npx',
      [
        '--no-install',
        'webpack',
        '--mode',
        'development',
        '--output-path',
        outputPath,
      ],
      { cwd: packageDirectory, stdio: ['ignore', 'ignore', 'inherit'] },
    );

    webpack.on('error', rejectPromise);
    webpack.on('exit', (code) =>
      code === 0
        ? resolvePromise(undefined)
        : rejectPromise(new Error(`webpack exited with code ${code}`)),
    );
  });

  return outputPath;
};

/**
 * Serves a directory over HTTP on a random local port.
 *
 * @param {string} directory
 * @returns {Promise<{ close: () => Promise<void>, url: string }>}
 */
export const serve = async (directory) => {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    const file = path.resolve(
      directory,
      `.${pathname === '/' ? '/index.html' : pathname}`,
    );

    if (!file.startsWith(directory) || !existsSync(file)) {
      response.writeHead(404).end();
      return;
    }

    response
      .writeHead(200, {
        'content-type': MIME_TYPES[path.extname(file)] ?? 'text/plain',
      })
      .end(await readFile(file));
  });

  await new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => resolvePromise(undefined));
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('server has no port');
  }

  return {
    close: () =>
      new Promise((resolvePromise) => {
        server.close(() => resolvePromise());
      }),
    url: `http://127.0.0.1:${address.port}/`,
  };
};

/**
 * @typedef {{
 *   close: () => Promise<void>,
 *   send: (method: string, params?: Record<string, unknown>) => Promise<any>,
 * }} Browser
 */

/**
 * Launches headless Chrome and connects to its first page via CDP.
 *
 * @returns {Promise<Browser>}
 */
export const launchBrowser = async () => {
  const executable = CHROME_CANDIDATES.find(
    (candidate) => candidate && existsSync(candidate),
  );
  if (!executable) {
    throw new Error('Chrome not found, set the CHROME environment variable');
  }

  const userDataDirectory = await mkdtemp(
    path.join(tmpdir(), 'base-ui-chrome-'),
  );
  const chrome = spawn(
    executable,
    [
      '--headless=new',
      '--disable-gpu',
      // A mouse (headless Chrome on Linux has none: no hover, no fine
      // pointer), as on macOS; hover and pointer types 2 and 4: hover, fine.
      '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
      '--hide-scrollbars',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDirectory}`,
      '--window-size=1400,900',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  /** @type {string} */
  const browserUrl = await new Promise((resolvePromise, rejectPromise) => {
    let output = '';

    chrome.stderr.on('data', (/** @type {Buffer} */ chunk) => {
      output += chunk.toString();
      const match = DEVTOOLS_URL.exec(output);
      if (match?.groups?.url) resolvePromise(match.groups.url);
    });
    chrome.on('exit', () => rejectPromise(new Error('Chrome exited')));
  });

  const { port } = new URL(browserUrl);
  const response = await fetch(`http://127.0.0.1:${port}/json`);
  const targets =
    /** @type {{ type: string, webSocketDebuggerUrl: string }[]} */ (
      await response.json()
    );
  const page = targets.find(({ type }) => type === 'page');
  if (!page) throw new Error('no page target');

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolvePromise) => {
    socket.addEventListener('open', resolvePromise, { once: true });
  });

  let id = 0;
  /** @type {Map<number, (message: any) => void>} */
  const pending = new Map();

  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(String(data));
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  });

  return {
    close: async () => {
      socket.close();

      const exited = new Promise((resolvePromise) => {
        chrome.once('exit', resolvePromise);
      });
      chrome.kill();
      await exited;

      await rm(userDataDirectory, {
        force: true,
        maxRetries: 5,
        recursive: true,
      });
    },
    send: (method, params = {}) =>
      new Promise((resolvePromise, rejectPromise) => {
        id += 1;
        pending.set(id, (message) =>
          message.error
            ? rejectPromise(new Error(`${method}: ${message.error.message}`))
            : resolvePromise(message.result),
        );
        socket.send(JSON.stringify({ id, method, params }));
      }),
  };
};

/**
 * A mapped prop's value in a demo's initial state (see `Page.open`): by its
 * label.
 *
 * @param {string} label
 */
export const mapped = (label) => `$${label}`;

/**
 * Collects the demo's log (its `demo-log` events), from the page's start
 * (once, however many pages add it).
 */
const COLLECT_LOG = `
  if (!window.demoLog) {
    window.demoLog = [];
    addEventListener('demo-log', ({ detail }) => window.demoLog.push(detail));
  }
`;

/**
 * Page helpers for tests. Only the opened demo is rendered, raw (the
 * component only, see `open`), its props set by the URL fragment.
 */
export class Page {
  /** @type {Browser} */
  browser;

  /** The opened demo's id (see `open`). */
  id = '';

  /** @type {string | undefined} */
  screenshotDirectory;

  /**
   * The opened demo's prop control states (see `open`, `setState`).
   *
   * @type {(Record<string, unknown> | null | undefined)[]}
   */
  state = [];

  /** @type {string} */
  url;

  /** Whether the log is collected on new documents (see `log`). */
  #logging = false;

  /**
   * @param {Browser} cdp the browser to drive
   * @param {string} demoUrl the served demo
   * @param {string | undefined} screenshots directory for screenshots
   */
  constructor(cdp, demoUrl, screenshots) {
    this.browser = cdp;
    this.url = demoUrl;
    this.screenshotDirectory = screenshots;
  }

  /** JavaScript expression for the opened demo's element (raw: the body). */

  get section() {
    return 'document.body';
  }

  /** The URL fragment for the opened demo and its state (see `open`). */
  get #fragment() {
    const fragment = new URLSearchParams({
      id: JSON.stringify(this.id),
      raw: 'true',
    });
    if (this.state.length > 0) {
      fragment.set(
        'state',
        JSON.stringify(Array.from(this.state, (entry) => entry ?? null)),
      );
    }
    return fragment.toString();
  }

  /**
   * Clicks at viewport coordinates, holding the button for `hold` ms.
   *
   * @param {[number, number]} point
   * @param {number} [hold]
   */
  async click(point, hold = 80) {
    await this.mouse('mousePressed', ...point);
    await sleep(hold);
    await this.mouse('mouseReleased', ...point);
  }

  /**
   * Presses the mouse, moves it in steps and releases it.
   *
   * @param {[number, number]} from
   * @param {[number, number]} to
   * @param {{ duration?: number, onStep?: (x: number, y: number, step: number) => Promise<void>, steps?: number }} [options]
   */
  async drag(from, to, { duration = 400, onStep, steps = 10 } = {}) {
    await this.mouse('mousePressed', ...from);
    await sleep(duration / (steps + 1));

    for (let step = 1; step <= steps; step += 1) {
      const x = from[0] + ((to[0] - from[0]) * step) / steps;
      const y = from[1] + ((to[1] - from[1]) * step) / steps;
      await this.mouse('mouseMoved', x, y);
      await sleep(duration / (steps + 1));
      await onStep?.(x, y, step);
    }

    await this.mouse('mouseReleased', ...to);
  }

  /**
   * Evaluates an expression in the page, awaiting promises.
   *
   * @param {string} expression
   * @returns {Promise<any>}
   */
  async evaluate(expression) {
    const { exceptionDetails, result } = await this.browser.send(
      'Runtime.evaluate',
      { awaitPromise: true, expression, returnByValue: true },
    );
    if (exceptionDetails) {
      throw new Error(`${expression}: ${exceptionDetails.text}`);
    }

    return result.value;
  }

  /**
   * Presses and releases a key on the focused element.
   *
   * @param {string} key a `KeyboardEvent.key` value, e.g. `End`
   */
  async key(key) {
    for (const type of ['keyDown', 'keyUp']) {
      await this.browser.send('Input.dispatchKeyEvent', {
        code: key,
        key,
        type,
      });
    }
    await sleep(300);
  }

  /**
   * The demo's log so far (its lines, joined by newlines).
   *
   * @returns {Promise<string>}
   */
  async log() {
    return this.evaluate(String.raw`(window.demoLog ?? []).join('\n')`);
  }

  /**
   * Dispatches a mouse event at viewport coordinates.
   *
   * @param {'mouseMoved' | 'mousePressed' | 'mouseReleased'} type
   * @param {number} x
   * @param {number} y
   */
  async mouse(type, x, y) {
    await this.browser.send('Input.dispatchMouseEvent', {
      button: 'left',
      buttons: type === 'mouseReleased' ? 0 : 1,
      clickCount: 1,
      type,
      x,
      y,
    });
  }

  /**
   * Loads the demo of an id, raw (only the component), in the given color
   * scheme.
   *
   * @param {string} id the demo's id
   * @param {'dark' | 'light'} [colorScheme]
   * @param {object} [options]
   * @param {(Record<string, unknown> | null | undefined)[]} [options.state]
   *   initial props, per prop control (in the demo's order of controls, a
   *   missing one keeps its own): verbatim (props left out are `undefined`),
   *   or, with `$rest: true`, over the control's own; mapped props by their
   *   label (`mapped`); changed later by `setState`
   */
  async open(id, colorScheme = 'light', { state = [] } = {}) {
    if (!this.#logging) {
      await this.browser.send('Page.addScriptToEvaluateOnNewDocument', {
        source: COLLECT_LOG,
      });
      this.#logging = true;
    }
    await this.browser.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: colorScheme }],
    });
    this.id = id;
    this.state = [...state];
    // Only the hash differs between tests, so leave the page first to get a
    // fresh load instead of a same-document navigation.
    await this.browser.send('Page.navigate', { url: 'about:blank' });
    await this.browser.send('Page.navigate', {
      url: `${this.url}#${this.#fragment}`,
    });
    await this.waitFor(`Boolean(${this.section}.firstElementChild)`);
    await sleep(300);
  }

  /**
   * Returns the viewport rectangle of an element in the current section.
   *
   * @param {string} selector
   * @param {number} [index]
   * @returns {Promise<{ height: number, width: number, x: number, y: number }>}
   */
  async rect(selector, index = 0) {
    return this.evaluate(`(() => {
      const { height, width, x, y } = ${this.section}.querySelectorAll(${JSON.stringify(selector)})[${index}].getBoundingClientRect();
      return { height, width, x, y };
    })()`);
  }

  /**
   * Evaluates `expression` once per animation frame for `duration` ms.
   *
   * @param {string} expression
   * @param {number} [duration]
   * @returns {Promise<any[]>}
   */
  async sample(expression, duration = 600) {
    return this.evaluate(`(async () => {
      const samples = [];
      const end = performance.now() + ${duration};
      while (performance.now() < end) {
        samples.push(${expression});
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return samples;
    })()`);
  }

  /**
   * Saves a screenshot of the viewport (only when a screenshot directory is
   * set).
   *
   * @param {string} name
   */
  async screenshot(name) {
    if (!this.screenshotDirectory) return;

    const { data } = await this.browser.send('Page.captureScreenshot', {});

    await writeFile(
      path.join(this.screenshotDirectory, `${name}.png`),
      Buffer.from(data, 'base64'),
    );
  }

  /**
   * Sets props of a prop control of the opened demo (by its index, as in
   * `open`'s `state`), over its current ones (as `$rest`, unless the
   * control's state is verbatim), or `verbatim`, as all of them (props left
   * out are `undefined`), as the URL fragment (the demo applies it live).
   * An `undefined` value removes the prop: verbatim, it's `undefined`; over
   * the control's own, its own.
   *
   * @param {number} index
   * @param {Record<string, unknown>} props
   * @param {{ verbatim?: boolean }} [options]
   */
  async setState(index, props, { verbatim = false } = {}) {
    const current = this.state[index];
    const merged = verbatim
      ? props
      : { ...(current ?? { $rest: true }), ...props };
    this.state[index] = Object.fromEntries(
      Object.entries(merged).filter(([, value]) => value !== undefined),
    );
    await this.evaluate(`location.hash = ${JSON.stringify(this.#fragment)}`);
    await sleep(300);
  }

  /** Paints a striped background behind the demo, to reveal glass. */
  async stripes() {
    await this.evaluate(
      `document.body.style.backgroundImage = ${JSON.stringify('repeating-linear-gradient(90deg, #f00 0 20px, #00f 20px 40px, #0c0 40px 60px, #fc0 60px 80px)')}`,
    );
  }

  /**
   * Waits until an expression is truthy.
   *
   * @param {string} expression
   * @param {number} [timeout]
   */
  async waitFor(expression, timeout = 10_000) {
    const end = Date.now() + timeout;

    while (Date.now() < end) {
      try {
        if (await this.evaluate(expression)) return;
      } catch {
        // page not ready yet
      }
      await sleep(100);
    }

    throw new Error(`timed out waiting for ${expression}`);
  }
}

/**
 * @typedef {{
 *   name: string,
 *   run: (page: Page) => Promise<void>,
 * }} Test
 */

/**
 * Right-clicks at a point (a secondary click: `contextmenu` on mouse down).
 *
 * @param {Page} page
 * @param {[number, number]} point
 */
export const rightClick = async (page, [x, y]) => {
  for (const type of /** @type {const} */ (['mousePressed', 'mouseReleased'])) {
    await page.browser.send('Input.dispatchMouseEvent', {
      button: 'right',
      buttons: type === 'mousePressed' ? 2 : 0,
      clickCount: 1,
      type,
      x,
      y,
    });
  }
};

/**
 * Runs `action` with touch input (`Input.dispatchTouchEvent`) enabled.
 *
 * @param {Page} page
 * @param {(touch: (type: 'touchEnd' | 'touchMove' | 'touchStart', x?: number, y?: number) => Promise<void>) => Promise<void>} action
 */
export const withTouch = async (page, action) => {
  await page.browser.send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 5,
  });
  try {
    await action(async (type, x = 0, y = 0) => {
      await page.browser.send('Input.dispatchTouchEvent', {
        touchPoints: type === 'touchEnd' ? [] : [{ x, y }],
        type,
      });
    });
  } finally {
    // A touch left down (e.g. by a failed assertion) would block the next.
    await page.browser
      .send('Input.dispatchTouchEvent', { touchPoints: [], type: 'touchEnd' })
      .catch(() => undefined);
    await page.browser.send('Emulation.setTouchEmulationEnabled', {
      enabled: false,
    });
  }
};
