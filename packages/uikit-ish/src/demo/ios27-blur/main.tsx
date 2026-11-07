import './style.css';

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

// A test page (not a demo, nothing of the library's changed): iOS 27's blur
// at the top of an installed PWA (a Home Screen app; in Safari, as tall as
// the status bar alone), and what's reported to suppress it: a
// `position: fixed` element with a background color, at least 6px tall, at
// least 80% wide, within 4px of the top (see
// https://modernwebweekly.substack.com/p/so-whats-up-with-the-ios27-blur):
// the status bar then solid, in its color. Its variants (picked below) a
// strip at the top over a real page (its bar's edge effect), to tell
// whether it could be the edge effects' (see Viewport): blending into it.
// Added to the Home Screen as its own app (see scripts/demo-head.js).

type Variant =
  | 'fade'
  | 'half'
  | 'height-5'
  | 'height-6'
  | 'none'
  | 'progress'
  | 'red'
  | 'strip'
  | 'top-4'
  | 'top-5'
  | 'width-79'
  | 'width-80'
  | 'zero';

/** Each variant: its label, its strip's look (none: no strip). */
const variants: Record<
  Variant,
  {
    hasFade?: boolean;
    isProgress?: boolean;
    label: string;
    strip?: {
      color?: string;
      height?: string;
      opacity?: number;
      top?: string;
      width?: string;
    };
  }
> = {
  none: { label: 'None (iOS’ own blur)' },
  strip: { label: 'Strip (page background)', strip: {} },
  fade: {
    hasFade: true,
    label: 'Strip, fading into the edge effect',
    strip: {},
  },
  red: { label: 'Strip, red', strip: { color: '#ff3b30' } },
  half: { label: 'Strip, opacity 0.5', strip: { opacity: 0.5 } },
  zero: { label: 'Strip, opacity 0', strip: { opacity: 0 } },
  progress: {
    hasFade: true,
    isProgress: true,
    label: 'Strip, fading in as content scrolls under',
    strip: {},
  },
  'width-79': {
    label: 'Red, 79% wide',
    strip: { color: '#ff3b30', width: '79%' },
  },
  'width-80': {
    label: 'Red, 80% wide',
    strip: { color: '#ff3b30', width: '80%' },
  },
  'height-5': {
    label: 'Red, 5px tall',
    strip: { color: '#ff3b30', height: '5px' },
  },
  'height-6': {
    label: 'Red, 6px tall',
    strip: { color: '#ff3b30', height: '6px' },
  },
  'top-4': {
    label: 'Red, 6px tall, 4px from the top',
    strip: { color: '#ff3b30', height: '6px', top: '4px' },
  },
  'top-5': {
    label: 'Red, 6px tall, 5px from the top',
    strip: { color: '#ff3b30', height: '6px', top: '5px' },
  },
};

type Scheme = 'dark' | 'light' | 'system';

type Background = 'grouped' | 'plain';

/** How far (px) content scrolls under the bar for the strip to show fully. */
const progressDistance = 40;

/** Colored bands, as content under the bar (its blur easy to see). */
const bands = Array.from({ length: 24 }, (_, index) => index);

const hues = [0, 35, 60, 130, 200, 260, 310];

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

const App: FunctionComponent = () => {
  const [variant, setVariant] = useState<Variant>('none');
  const [edgeEffect, setEdgeEffect] = useState<ViewportEdgeEffect>('soft');
  const [scheme, setScheme] = useState<Scheme>('system');
  const [background, setBackground] = useState<Background>('grouped');
  const [progress, setProgress] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const { hasFade, isProgress, strip } = variants[variant];

  // Its color scheme: the document's (the status bar's too, as the system's).
  useEffect(() => {
    const { documentElement: root } = document;
    if (scheme === 'system') delete root.dataset.colorScheme;
    else root.dataset.colorScheme = scheme;
    return () => {
      delete root.dataset.colorScheme;
    };
  }, [scheme]);

  // How far content has scrolled under the bar (0 to 1).
  useEffect(() => {
    const { current: page } = pageRef;
    if (!page) return undefined;
    const update = () => {
      setProgress(Math.min(Math.max(page.scrollTop / progressDistance, 0), 1));
    };
    update();
    page.addEventListener('scroll', update, { passive: true });
    return () => page.removeEventListener('scroll', update);
  }, []);

  const opacity = isProgress ? progress : (strip?.opacity ?? 1);

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
                <span>iOS 27 Blur</span>
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
            <div className="ios27-blur-controls">
              <Choice
                label="Variant"
                value={variant}
                options={Object.entries(variants).map(
                  ([key, { label }]) => [key as Variant, label] as const,
                )}
                onChange={setVariant}
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
            </div>
          </Viewport.BlockEnd>
        </Header.Root>
      </Viewport.Content>
      {strip ? (
        <div
          aria-hidden="true"
          className="ios27-blur-strip"
          data-background={background}
          data-fade={hasFade ? '' : undefined}
          style={
            {
              '--ios27-blur-strip-color': strip.color,
              '--ios27-blur-strip-height': strip.height,
              '--ios27-blur-strip-top': strip.top,
              '--ios27-blur-strip-width': strip.width,
              opacity,
            } as CSSProperties
          }
        />
      ) : null}
    </Viewport.Provider>
  );
};

/** `/ios27-blur`: the test page, the page's own (see `useRawDocument`). */
export const Ios27BlurPage: FunctionComponent = () => {
  useRawDocument(true, 'iOS 27 Blur');

  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
};
