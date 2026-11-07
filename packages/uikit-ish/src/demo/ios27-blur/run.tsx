// The test page's guided round (see main.tsx), for a tester who isn't a
// developer: the guide (`/ios27-blur`, in Safari), its setup
// (`/ios27-blur/<style>/start`: adding it to the Home Screen as an app of
// its own, its manifest's), the round in the app (its variants' pages
// loaded one after another, two questions on each), its end
// (`/ios27-blur/<style>/done`: its results copied). Its progress kept in
// local storage (the Home Screen app's own).

import { FunctionComponent, ReactNode, useEffect, useState } from 'react';

import { Page, Viewport } from '../../components/index.js';
import { publicUrl } from '../tooling/public-url.js';
import { clearLog, readLog, record, snapshot } from './log.js';
import {
  go,
  pathOf,
  type Status,
  titleOf,
  type Variant,
  variantKeys,
} from './variants.js';

/** The round's status bar style (see variants.ts). */
const round: Status = 'black-translucent';

const runKey = 'ios27-blur-run';

type Run = { index: number; status: Status };

const readRun = (): Run | undefined => {
  try {
    const value = localStorage.getItem(runKey);
    return value === null ? undefined : (JSON.parse(value) as Run);
  } catch {
    return undefined;
  }
};

const writeRun = (run: Run | undefined) => {
  try {
    if (run) localStorage.setItem(runKey, JSON.stringify(run));
    else localStorage.removeItem(runKey);
  } catch {
    // (Storage unavailable: no round.)
  }
};

/** Installed (opened from the Home Screen), or in Safari. */
const isInstalled = () =>
  matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

const startRun = (status: Status) => {
  clearLog();
  record(`ROUND START ${status} (${String(variantKeys.length)} screens)`);
  writeRun({ index: 0, status });
  go(status, variantKeys[0] ?? 'none');
};

/** On a round's screen (`variant`): which, of how many; else none. */
export const useRunStep = (
  status: Status | undefined,
  variant: Variant,
): { index: number; total: number } | undefined => {
  const [step] = useState(() => {
    const run = readRun();
    if (!run || run.status !== status) return undefined;
    return variantKeys[run.index] === variant
      ? { index: run.index, total: variantKeys.length }
      : undefined;
  });
  return step;
};

/** Its answer, then the next screen (or the round's end). */
const advance = (status: Status, index: number, answer: string) => {
  snapshot(`ANSWER ${variantKeys[index] ?? '?'}: ${answer}`);
  const next = index + 1;
  if (next >= variantKeys.length) {
    writeRun(undefined);
    record('ROUND END');
    go(status, 'done');
    return;
  }
  writeRun({ index: next, status });
  go(status, variantKeys[next] ?? 'none');
};

// What's up at the clock (the status bar, above the title bar's buttons),
// as pictures (see `Picture`): the tester picks the nearest, a note for
// what it misses.
const looks = [
  ['clear', 'The stripes, sharp'],
  ['blur', 'The stripes, blurred'],
  ['bar', 'A bar of one color, covering the stripes'],
  ['other', 'None of these (please describe below)'],
] as const;

// A bar's color (asked apart, the pictures showing none: not matched by
// color): blending into the page around the stripes, or not.
const blendAnswers = [
  ['blends', 'Yes, it blends in'],
  ['stands-out', 'No, it stands out'],
  ['unsure', 'Not sure'],
] as const;

// The title bar's own buttons and title (not the stripes behind it, soft by
// design: its edge effect): iOS 27's blur over them, or not.
const barAnswers = [
  ['sharp', 'Sharp, as usual'],
  ['blurry', 'Blurry'],
  ['unsure', 'Not sure'],
] as const;

type Look = (typeof looks)[number][0];

/**
 * A picture of the top of a phone (see style.css): its clock, its title
 * bar's buttons, stripes beneath; as `look` (none of them: veiled).
 */
const Picture: FunctionComponent<{ look: Look }> = ({ look }) => (
  <span
    aria-hidden="true"
    className="ios27-blur-picture"
    data-look={look}
  >
    <span className="ios27-blur-picture-stripes" />
    <span className="ios27-blur-picture-effect" />
    <span className="ios27-blur-picture-clock">9:41</span>
    <span className="ios27-blur-picture-bar">
      <span />
      <span />
      <span />
    </span>
  </span>
);

/** A round's screen's question (in its bottom bar, see main.tsx). */
export const RunQuestions: FunctionComponent<{
  index: number;
  status: Status;
  total: number;
}> = ({ index, status, total }) => {
  const [look, setLook] = useState<Look | undefined>();
  const [bar, setBar] = useState<string | undefined>();
  const [blend, setBlend] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const isAnswered =
    look !== undefined &&
    (look !== 'bar' || blend !== undefined) &&
    bar !== undefined &&
    (look !== 'other' || note.trim() !== '');

  return (
    <div className="ios27-blur-run">
      <p className="ios27-blur-run-step">
        Screen {index + 1} of {total}
      </p>
      <p className="ios27-blur-ask">
        1. Up at the clock and the battery (above the title bar’s buttons):
        which picture fits best?
      </p>
      <div className="ios27-blur-looks">
        {looks.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={look === value}
            type="button"
            onClick={() => setLook(value)}
          >
            <Picture look={value} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      {look === 'bar' ? (
        <fieldset className="ios27-blur-question">
          <legend>
            Does that bar have the same color as the page’s background (the
            color beside and between the stripes), so it blends in?
          </legend>
          {blendAnswers.map(([value, label]) => (
            <button
              key={value}
              aria-pressed={blend === value}
              type="button"
              onClick={() => setBlend(value)}
            >
              {label}
            </button>
          ))}
        </fieldset>
      ) : null}
      <fieldset className="ios27-blur-question">
        <legend>
          2. The title bar’s own buttons (the round ones) and its title text:
          are they sharp, or blurry? (The stripes behind the bar look soft on
          purpose: ignore those.)
        </legend>
        {barAnswers.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={bar === value}
            type="button"
            onClick={() => setBar(value)}
          >
            {label}
          </button>
        ))}
      </fieldset>
      <label className="ios27-blur-note-field">
        <span>
          Anything else you notice? (optional; e.g. a thin line, a soft edge, a
          see-through color)
        </span>
        <textarea
          rows={2}
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
        />
      </label>
      <div className="ios27-blur-buttons">
        <button
          className="ios27-blur-primary"
          disabled={!isAnswered}
          type="button"
          onClick={() =>
            advance(
              status,
              index,
              `clock=${look ?? '?'}${look === 'bar' ? `/${blend ?? '?'}` : ''} bar=${bar ?? '?'} note=${JSON.stringify(note.trim())}`,
            )
          }
        >
          {index + 1 === total ? 'Finish the test' : 'Next screen'}
        </button>
        <button
          type="button"
          onClick={() => advance(status, index, 'skipped')}
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => {
            writeRun(undefined);
            record('ROUND STOPPED');
            go(status, 'start');
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

/** A page of text (the guide's, a round's setup or end), scrolling. */
const TextPage: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
  <Viewport.Provider>
    <Viewport.Content>
      <Page.Root background="plain">
        <Viewport.Padding edge="block-start" />
        <div className="ios27-blur-guide">{children}</div>
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Viewport.Content>
  </Viewport.Provider>
);

/** A link loading its page (its head read anew: not the router's). */
const PageLink: FunctionComponent<{ children: ReactNode; path: string }> = ({
  children,
  path,
}) => (
  <a
    href={publicUrl(path)}
    target="_top"
  >
    {children}
  </a>
);

/** `/ios27-blur`: what it's for, and how (in Safari). */
export const Guide: FunctionComponent = () => (
  <TextPage>
    <h1>Testing the blur at the top of the screen</h1>
    <p>
      Thank you for helping! On iOS 27, web apps added to the Home Screen show a
      blurry band at the top of the screen, below the clock. This test tries a
      few ways to get rid of it, and needs your eyes to tell which ones work. It
      takes about 5 minutes.
    </p>
    <p>
      You need an iPhone with iOS 27, and Safari. Keep the phone upright
      (portrait), and don’t switch between Light and Dark Mode during the test.
    </p>

    <h2>Before you start</h2>
    <p>
      If your Home Screen has icons named “Blur …” or “iOS 27 Blur” from an
      earlier test, delete them first: press and hold the icon, tap “Remove
      App”, then “Delete from Home Screen”.
    </p>

    <h2>How it works</h2>
    <p>
      The test runs as a little app on your Home Screen, because the blur only
      shows up there. You’ll add the app, open it, and go through its screens.
    </p>
    <p>
      The app shows you {variantKeys.length} screens, one after another. Each
      one has a title bar and colorful stripes underneath. On each screen you
      look at the top of the screen and answer two simple questions. You don’t
      need to understand what the screens test: just describe what you see. “Not
      sure” is a fine answer too.
    </p>
    <p>
      <PageLink path={pathOf(round, 'start')}>Start: add the test app</PageLink>
    </p>

    <h2>Sending the results</h2>
    <p>
      At the end, the app shows a “Copy results” button. Tap it, then paste the
      results into a message (Messages, Mail, or whatever you use) to the person
      who asked you to test.
    </p>

    <h2>For developers</h2>
    <p>
      Every screen can also be explored freely, with its settings, a log and
      snapshots (outside the round), e.g.{' '}
      <PageLink path={pathOf(round, 'none')}>the one without a strip</PageLink>.
    </p>
  </TextPage>
);

/** The round's setup (in Safari), or its start (in its Home Screen app). */
export const Start: FunctionComponent<{ status: Status }> = ({ status }) => {
  const [installed, setInstalled] = useState<boolean | undefined>();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once, on the client
    setInstalled(isInstalled());
  }, []);
  const name = `“${titleOf(status)}”`;

  if (installed === undefined) return null;

  if (!installed) {
    return (
      <TextPage>
        <h1>Add the {name} app</h1>
        <ol>
          <li>
            Tap the Share button: the square with an arrow pointing up. If you
            don’t see it, tap the “…” button first.
          </li>
          <li>Scroll down a little and tap “Add to Home Screen”.</li>
          <li>
            Keep the name {name}. If there’s an “Open as Web App” switch, leave
            it on. Tap “Add”.
          </li>
          <li>
            Go to your Home Screen and open the new {name} app. It shows this
            page again, with a button to start the test.
          </li>
        </ol>
        <p>
          <PageLink path="ios27-blur">Back to the guide</PageLink>
        </p>
      </TextPage>
    );
  }

  return (
    <TextPage>
      <h1>{name} is ready</h1>
      <p>
        You’ll see {variantKeys.length} screens. Each shows a title bar with
        colorful stripes, already scrolled so the stripes are under the clock.
        For each screen:
      </p>
      <ol>
        <li>Look at the very top of the screen, around the clock.</li>
        <li>Answer the two questions at the bottom of the screen.</li>
        <li>Tap “Next screen”.</li>
      </ol>
      <p>
        On each screen, answer two things: what’s up at the clock (pick the
        matching picture; if it’s a bar, whether its color blends into the
        page), and whether the title bar’s own buttons and title text look sharp
        or blurry. The stripes behind the title bar are meant to look soft:
        ignore those. If something doesn’t fit (a thin line, a soft edge, a
        see-through color), write a few words in the note field. During the
        test, the page is tinted blue, so its own color is easy to tell from
        black or white.
      </p>
      <p>
        Each new screen takes a moment to load. If one looks broken, answer “Not
        sure”, or tap “Skip”.
      </p>
      <div className="ios27-blur-buttons">
        <button
          className="ios27-blur-primary"
          type="button"
          onClick={() => startRun(status)}
        >
          Start the test
        </button>
      </div>
      <p className="ios27-blur-note">
        Starting clears results from an earlier try in this app.
      </p>
    </TextPage>
  );
};

/** The round's end: its results to copy, what's next. */
export const Done: FunctionComponent<{ status: Status }> = ({ status }) => {
  const [lines] = useState(readLog);
  const [copied, setCopied] = useState<boolean | undefined>();
  const text = lines.join('\n');

  return (
    <TextPage>
      <h1>Done. Thank you!</h1>
      <ol>
        <li>Tap “Copy results”.</li>
        <li>
          Open Messages (or Mail) and paste the results into a message to the
          person who asked you to test.
        </li>
        <li>
          That’s all. You can delete the {`“${titleOf(status)}”`} app from your
          Home Screen now.
        </li>
      </ol>
      <div className="ios27-blur-buttons">
        <button
          className="ios27-blur-primary"
          type="button"
          onClick={() => {
            navigator.clipboard
              .writeText(text)
              .then(() => setCopied(true))
              .catch(() => setCopied(false));
          }}
        >
          Copy results
        </button>
        <button
          type="button"
          onClick={() => go(status, 'start')}
        >
          Do the test again
        </button>
      </div>
      {copied === true ? (
        <p className="ios27-blur-note">Copied. Now paste it into a message.</p>
      ) : null}
      {copied === false ? (
        <p className="ios27-blur-note">
          Copying didn’t work. Press and hold the text below, tap “Select All”,
          then “Copy”.
        </p>
      ) : null}
      <textarea
        readOnly
        aria-label="Results"
        className="ios27-blur-results"
        value={text}
      />
    </TextPage>
  );
};
