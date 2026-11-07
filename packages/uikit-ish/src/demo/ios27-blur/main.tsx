import './style.css';

import { useRoute } from 'preact-iso';
import {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Header,
  Page,
  Symbol,
  Toolbar,
  Viewport,
  type ViewportEdgeEffect,
} from '../../components/index.js';
import {
  sfChevronBackward,
  sfEllipsis,
  sfMagnifyingglass,
  sfSquareAndPencil,
} from '../tooling/icons.js';
import { ClientOnly } from '../tooling/shared/client-only.js';
import { useRawDocument } from '../tooling/shared/raw-document.js';
import { Log, snapshot } from './log.js';
import { Done, Guide, RunQuestions, Start, useRunStep } from './run.js';
import {
  go,
  isStatus,
  isVariant,
  siteStatus,
  type Status,
  type Strip,
  titleOf,
  type Variant,
  variantKeys,
  variants,
} from './variants.js';

// A test page (not a demo, nothing of the library's changed): iOS 27's blur
// at the top of an installed PWA (a Home Screen app; in Safari, as tall as
// the status bar alone), and what's reported to suppress it: a
// `position: fixed` element with a background color, near the top (see
// https://modernwebweekly.substack.com/p/so-whats-up-with-the-ios27-blur,
// https://github.com/bskp/rechords/pull/75,
// https://github.com/stackernews/stacker.news/pull/3248): the status bar
// then solid, in its color. Its variants a strip at the top over a real
// page (its bar's edge effect), to tell whether it could be the edge
// effects' (see Viewport).
// Each variant, and each status bar style, a page of its own
// (`/ios27-blur/<style>/<variant>`, prerendered, see demo-ssg.tsx), its
// strip in its HTML as loaded (outside `ClientOnly`, hydrated in place),
// switched by loading another. Its status bar style set by the head (see
// scripts/demo-head.js), read as it's added to the Home Screen: each style
// its own app (named for it). A log to paste back (see log.tsx).

type Scheme = 'dark' | 'light' | 'system';

type Background = 'grouped' | 'plain';

/** How far (px) a round's screen is scrolled (its stripes under the clock). */
const runScroll = 240;

/** How far (px) content scrolls under the bar for the strip to show fully. */
const progressDistance = 40;

/** Colored bands, as content under the bar (its blur easy to see). */
const bands = Array.from({ length: 24 }, (_, index) => index);

const hues = [0, 35, 60, 130, 200, 260, 310];

/** A setting kept (in local storage) across the variants' pages. */
const useKept = <T extends string>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      return (localStorage.getItem(`ios27-blur-${key}`) as T | null) ?? initial;
    } catch {
      return initial;
    }
  });
  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(`ios27-blur-${key}`, next);
    } catch {
      // (Storage unavailable: not kept.)
    }
  };
  return [value, set] as const;
};

/** A bar's button (an icon alone; pressable, doing nothing). */
const iconButton = (label: string, icon: typeof sfEllipsis) => (
  <Toolbar.Button
    aria-label={label}
    disabled={false}
    shape="circle"
  >
    <Button.Icon>
      <Symbol icon={icon} />
    </Button.Icon>
  </Toolbar.Button>
);

/** A native select (a test page's: no component of the library's). */
const Choice = <T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly (readonly [T, string])[];
  value: T;
}) => (
  <label className="ios27-blur-choice">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.currentTarget.value as T)}
    >
      {options.map(([key, text]) => (
        <option
          key={key}
          value={key}
        >
          {text}
        </option>
      ))}
    </select>
  </label>
);

/**
 * The strip (a variant's), prerendered: in the page's HTML as it loads,
 * fixed at the top; its color the page's background (see style.css: the
 * document's, as the app sets it), its opacity, scrolled, the app's too.
 */
const StripElement: FunctionComponent<{ variant: Variant }> = ({ variant }) => {
  const { strip } = variants[variant] as { strip?: Strip };
  if (!strip) return null;

  return (
    <div
      aria-hidden="true"
      className="ios27-blur-strip"
      data-clip={strip.clip ? '' : undefined}
      data-fade={strip.fade ? '' : undefined}
      data-progress={strip.progress ? '' : undefined}
      style={
        {
          '--ios27-blur-strip-color': strip.color,
          '--ios27-blur-strip-height': strip.height,
          '--ios27-blur-strip-opacity':
            strip.opacity === undefined ? undefined : String(strip.opacity),
          '--ios27-blur-strip-top': strip.top,
          '--ios27-blur-strip-width': strip.width,
        } as CSSProperties
      }
    />
  );
};

const App: FunctionComponent<{
  status: Status | undefined;
  variant: Variant;
}> = ({ status, variant }) => {
  const [keptEdgeEffect, setEdgeEffect] = useKept<ViewportEdgeEffect>(
    'edge',
    'soft',
  );
  const [keptScheme, setScheme] = useKept<Scheme>('scheme', 'system');
  const [keptBackground, setBackground] = useKept<Background>(
    'background',
    'grouped',
  );
  const pageRef = useRef<HTMLDivElement>(null);
  // In a round (see run.tsx): its questions for the controls, the defaults
  // for the settings (each screen as the others).
  const step = useRunStep(status, variant);
  const edgeEffect = step ? 'soft' : keptEdgeEffect;
  const scheme = step ? 'system' : keptScheme;
  const background = step ? 'grouped' : keptBackground;

  // Its color scheme and background: the document's (the strip's too).
  useEffect(() => {
    const { documentElement: root } = document;
    if (scheme === 'system') delete root.dataset.colorScheme;
    else root.dataset.colorScheme = scheme;
    root.dataset.ios27BlurBackground = background;
    return () => {
      delete root.dataset.colorScheme;
      delete root.dataset.ios27BlurBackground;
    };
  }, [background, scheme]);

  // How far content has scrolled under the bar (0 to 1, the document's).
  useEffect(() => {
    const { current: element } = pageRef;
    if (!element) return undefined;
    const { documentElement: root } = document;
    const update = () => {
      root.style.setProperty(
        '--ios27-blur-progress',
        String(Math.min(Math.max(element.scrollTop / progressDistance, 0), 1)),
      );
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    return () => {
      element.removeEventListener('scroll', update);
      root.style.removeProperty('--ios27-blur-progress');
    };
  }, []);

  // (Mounted: what's at the top now, the app's bars in; in a round,
  // scrolled first, the stripes under the clock.)
  const isRun = step !== undefined;
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (isRun) pageRef.current?.scrollTo({ top: runScroll });
      snapshot('mounted');
    });
    return () => cancelAnimationFrame(frame);
  }, [isRun]);

  return (
    <Viewport.Provider>
      <Viewport.Content>
        <Header.Root>
          <Viewport.BlockStart edgeEffect={edgeEffect}>
            {/* (Buttons, a title and a subtitle: what's in the bar, near the
                status bar, blurred where it shouldn't be.) */}
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {iconButton('Back', sfChevronBackward)}
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>{titleOf(status)}</span>
                <Toolbar.Subtitle>{variants[variant].label}</Toolbar.Subtitle>
              </Toolbar.Title>
              <Toolbar.Trailing>
                {iconButton('Search', sfMagnifyingglass)}
                {iconButton('Compose', sfSquareAndPencil)}
                {iconButton('More', sfEllipsis)}
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            ref={pageRef}
            background={background}
          >
            <Viewport.Padding edge="block-start" />
            <div className="ios27-blur-bands">
              {bands.map((index) => (
                <div
                  key={index}
                  className="ios27-blur-band"
                  style={
                    {
                      '--ios27-blur-hue': String(
                        hues[index % hues.length] ?? 0,
                      ),
                    } as CSSProperties
                  }
                >
                  <strong>Band {index + 1}</strong>
                  <span>
                    The quick brown fox jumps over the lazy dog. Text near the
                    top shows how far the blur reaches.
                  </span>
                </div>
              ))}
            </div>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
          <Viewport.BlockEnd edgeEffect="soft">
            {step && status ? (
              <RunQuestions
                index={step.index}
                status={status}
                total={step.total}
              />
            ) : (
              <div className="ios27-blur-controls">
                <Choice
                  label="Variant"
                  value={variant}
                  options={variantKeys.map(
                    (key) => [key, variants[key].label] as const,
                  )}
                  onChange={(next) => go(status ?? siteStatus, next)}
                />
                <Choice
                  label="Edge effect"
                  value={edgeEffect}
                  options={[
                    ['soft', 'Soft'],
                    ['hard', 'Hard'],
                    ['none', 'None'],
                  ]}
                  onChange={setEdgeEffect}
                />
                <Choice
                  label="Color scheme"
                  value={scheme}
                  options={[
                    ['system', 'System'],
                    ['light', 'Light'],
                    ['dark', 'Dark'],
                  ]}
                  onChange={setScheme}
                />
                <Choice
                  label="Background"
                  value={background}
                  options={[
                    ['grouped', 'Grouped'],
                    ['plain', 'Plain'],
                  ]}
                  onChange={setBackground}
                />
                <Log />
              </div>
            )}
          </Viewport.BlockEnd>
        </Header.Root>
      </Viewport.Content>
    </Viewport.Provider>
  );
};

/**
 * `/ios27-blur` (the guide, see run.tsx), `/ios27-blur/<style>/start` and
 * `…/done` (a round's setup and end), `/ios27-blur/<style>/<variant>` (a
 * variant's page: a round's screen, or explored): the page's own (see
 * `useRawDocument`).
 */
export const Ios27BlurPage: FunctionComponent = () => {
  const { params } = useRoute();
  const status = isStatus(params.status) ? params.status : undefined;
  const variant = isVariant(params.variant) ? params.variant : 'none';
  useRawDocument(true, titleOf(status));

  if (status === undefined) {
    return (
      <ClientOnly>
        <Guide />
      </ClientOnly>
    );
  }
  if (params.variant === 'start' || params.variant === 'done') {
    const Step = params.variant === 'start' ? Start : Done;
    return (
      <ClientOnly>
        <Step status={status} />
      </ClientOnly>
    );
  }

  return (
    <>
      <StripElement variant={variant} />
      <ClientOnly>
        <App
          status={status}
          variant={variant}
        />
      </ClientOnly>
    </>
  );
};
