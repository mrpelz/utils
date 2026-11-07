// The test page's log (see main.tsx): what the device reports, as the page
// loads and on demand (a snapshot), and what's seen (noted by a button), to
// paste back. Kept in local storage (across the variants' pages, a reload).
// Each line: its time, its page (status bar style, variant), what happened.

import { FunctionComponent, useEffect, useState } from 'react';

const storageKey = 'ios27-blur-log';
const limit = 800;

/** The log's lines. */
export const readLog = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const listeners = new Set<() => void>();

/** Clears the log. */
export const clearLog = (): void => {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // (Storage unavailable.)
  }
  for (const listener of listeners) listener();
};

const page = () => {
  const parts = location.pathname.split('/').filter(Boolean);
  const at = parts.lastIndexOf('ios27-blur');
  return at === -1 ? '?' : parts.slice(at + 1).join('/') || '(root)';
};

/** Logs `lines` (the first one timed, the others indented under it). */
export const record = (...lines: string[]): void => {
  const now = new Date();
  const time = `${now.toTimeString().slice(0, 8)}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  const [first = '', ...rest] = lines;
  const entry = [
    `${time} [${page()}] ${first}`,
    ...rest.map((line) => `    ${line}`),
  ];
  try {
    const all = [...readLog(), ...entry].slice(-limit);
    localStorage.setItem(storageKey, JSON.stringify(all));
  } catch {
    // (Storage unavailable: nothing kept.)
  }
  for (const listener of listeners) listener();
};

const round = (value: number) => String(Math.round(value * 10) / 10);

const box = (rect: DOMRect) =>
  `${round(rect.x)},${round(rect.y)} ${round(rect.width)}x${round(rect.height)}`;

/** An element, briefly: its tag, its first class (or its part). */
const describe = (element: Element) => {
  const [className] = element.classList;
  const part = [...element.attributes].find(({ name }) =>
    name.endsWith('-part'),
  );
  return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}${part ? `[${part.name}=${part.value}]` : ''}`;
};

/** The safe area's insets (as `env()` resolves them now). */
const insets = () => {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const value = `t${style.paddingTop} r${style.paddingRight} b${style.paddingBottom} l${style.paddingLeft}`;
  probe.remove();
  return value;
};

/** What's fixed or sticky near the top (Safari's sampling: within 10px). */
const topElements = () => {
  const lines: string[] = [];
  for (const element of document.body.querySelectorAll('*')) {
    const style = getComputedStyle(element);
    if (style.position !== 'fixed' && style.position !== 'sticky') continue;
    const rect = element.getBoundingClientRect();
    if (rect.top > 10 || rect.bottom <= 0 || rect.width === 0) continue;
    const backdrop =
      style.backdropFilter ||
      style.getPropertyValue('-webkit-backdrop-filter') ||
      'none';
    lines.push(
      `${describe(element)} ${style.position} ${box(rect)} (${round((rect.width / innerWidth) * 100)}% wide) bg ${style.backgroundColor} clip ${style.backgroundClip} backdrop ${backdrop} opacity ${style.opacity} z ${style.zIndex} pe ${style.pointerEvents} display ${style.display}`,
    );
  }
  return lines.length > 0 ? lines : ['(none)'];
};

/** What's hit at the top's middle (pointer-events: none skipped). */
const hits = () =>
  [2, 4, 10].map((y) => {
    const elements = document
      .elementsFromPoint(innerWidth / 2, y)
      .slice(0, 4)
      .map((element) => describe(element));
    return `hit @${String(y)}px: ${elements.join(' > ') || '(none)'}`;
  });

const meta = (name: string) =>
  document
    .querySelector(`meta[name="${CSS.escape(name)}"]`)
    ?.getAttribute('content') ?? '(none)';

/** The device and the page, as they are now. */
const environment = () => {
  const { visualViewport: viewport } = window;
  return [
    `ua ${navigator.userAgent}`,
    `standalone mq ${String(matchMedia('(display-mode: standalone)').matches)} nav ${String((navigator as { standalone?: boolean }).standalone ?? '?')}`,
    `status-bar-style ${meta('apple-mobile-web-app-status-bar-style')} title ${meta('apple-mobile-web-app-title')}`,
    `viewport ${meta('viewport')}`,
    `win ${String(innerWidth)}x${String(innerHeight)} screen ${String(screen.width)}x${String(screen.height)} dpr ${String(devicePixelRatio)} vv ${round(viewport?.height ?? 0)}+${round(viewport?.offsetTop ?? 0)}`,
    `insets ${insets()}`,
    `scheme ${matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} (override ${document.documentElement.dataset.colorScheme ?? 'none'}) body bg ${getComputedStyle(document.body).backgroundColor} html bg ${getComputedStyle(document.documentElement).backgroundColor}`,
  ];
};

/** A snapshot: what's at the top now. */
export const snapshot = (label: string): void => {
  // (The page's scroller: the bars' content, not the first registered.)
  const scroller =
    document.querySelector('.uikit-page-root') ??
    document.querySelector('[data-viewport-scroller]');
  record(
    `${label} (scrolled ${round(scroller?.scrollTop ?? 0)})`,
    ...topElements(),
    ...hits(),
  );
};

// (On the test page only: the module's in every page's bundle.)
if (
  typeof window !== 'undefined' &&
  location.pathname.split('/').includes('ios27-blur')
) {
  // (As the script runs, before hydrating: the prerendered strip there, or
  // not, i.e. in the HTML as loaded.)
  const strip = document.querySelector('.ios27-blur-strip');
  record(
    `script start: strip in loaded HTML ${strip ? 'yes' : 'no'}, readyState ${document.readyState}`,
    ...environment(),
  );
  addEventListener('load', () => snapshot('window load'));
  addEventListener('pageshow', (event) =>
    record(`pageshow persisted ${String(event.persisted)}`),
  );
  document.addEventListener('visibilitychange', () =>
    record(`visibility ${document.visibilityState}`),
  );
  addEventListener('orientationchange', () =>
    record(`orientation ${screen.orientation.type}`),
  );
}

/** The log's buttons (notes, a snapshot) and its panel. */
export const Log: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setLines(readLog());
    update();
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return (
    <>
      <div className="ios27-blur-buttons">
        <button
          type="button"
          onClick={() => snapshot('NOTE: blurred')}
        >
          Blurred
        </button>
        <button
          type="button"
          onClick={() => snapshot('NOTE: not blurred')}
        >
          Not blurred
        </button>
        <button
          type="button"
          onClick={() => snapshot('snapshot')}
        >
          Snapshot
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Log ({lines.length})
        </button>
      </div>
      {isOpen ? (
        <div className="ios27-blur-log">
          <div className="ios27-blur-buttons">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(lines.join('\n')).catch(() => {
                  // (Not copied.)
                });
              }}
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(storageKey);
                } catch {
                  // (Storage unavailable.)
                }
                setLines([]);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
          <pre>{lines.join('\n')}</pre>
        </div>
      ) : null}
    </>
  );
};
