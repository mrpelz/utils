import '../../../components/glass/style.css';
import './style.css';

import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

// (The stylesheet as written, its text: `!` skips the configured loaders,
// not the rules' types, as `!!` would, see parse.ts.)
import tokensCss from '!../../../styles.css' with { type: 'text' };

import {
  Button,
  Card,
  Symbol,
  useBackdropMarker,
  useBackdropTone,
  useImageBackdropMarker,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import {
  code,
  type PropRow,
  PropsTable,
  union,
} from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
  sectionId,
} from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfEllipsis,
  sfHeartFill,
  sfLightbulbLedFill,
  sfPlayFill,
  sfSquareAndArrowUp,
  sfSunMaxFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { titleCase } from '../../tooling/shared/title-case.js';
import { parseTokens, type Token } from './parse.js';

const groups = parseTokens(tokensCss as string);
const tokens = groups.flatMap((group) => group.tokens);

/** The tokens whose names start with `prefix`. */
const withPrefix = (prefix: string) =>
  tokens.filter(({ name }) => name.startsWith(prefix));

/** A token's value with increased contrast, if it has one. */
const contrastOf = ({ variants }: Token) =>
  variants.find(({ condition }) => condition.includes('prefers-contrast'))
    ?.value;

/** A token's value and its variants, one per line (e.g. for a title). */
const describe = ({ name, value, variants }: Token) =>
  [
    name,
    value,
    ...variants.map(
      ({ condition, value: variantValue }) => `${condition}: ${variantValue}`,
    ),
  ].join('\n');

// Colors, by their roles (their names): the first matching.
const colorRoles: readonly [title: string, pattern: RegExp][] = [
  ['Tint', /^--color-ui-primary/u],
  ['Labels', /label|placeholder/u],
  ['Separators', /separator/u],
  ['Link', /link/u],
  ['Fills', /fill/u],
  ['Backgrounds', /background/u],
  ['System colors', /^--color-ui-system-/u],
  ['Components’', /./u],
];

const colorsByRole = colorRoles
  .map(([title, pattern], index): [string, Token[]] => [
    title,
    withPrefix('--color-ui-').filter(
      ({ name }) =>
        pattern.test(name) &&
        colorRoles.slice(0, index).every(([, earlier]) => !earlier.test(name)),
    ),
  ])
  .filter(([, roleTokens]) => roleTokens.length > 0);

// Text styles, by their tokens' names: `--font-ui-<style>-<metric>`.
const textStyleMetric =
  /^--font-ui-(?<style>.+?)-(?:size|line-height|tracking|weight-emphasized|weight)$/u;

const textStyles = [
  ...new Set(
    withPrefix('--font-ui-')
      .map(({ name }) => textStyleMetric.exec(name)?.groups?.style)
      .filter((style) => style !== undefined),
  ),
];

const valueOf = (name: string) =>
  tokens.find((token) => token.name === name)?.value ?? '';

/** `large-title` as “Large Title”, `title1` as “Title 1”. */
const titleOf = (style: string) =>
  style
    .replaceAll(/(?<digit>\d)/gu, ' $<digit>')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// The glass contexts: each on a backdrop of what it's for (bright content,
// dim content), and `adaptive` on a bright and a dim background of an
// app's, picking by what's behind it.
const glassContexts = [
  ['bright', 'light', 'On bright content'],
  ['dim', 'dark', 'On dim content'],
  ['adaptive', 'vivid-light', 'By what’s behind it (here, bright)'],
  ['adaptive', 'vivid-dark', 'By what’s behind it (here, dim)'],
] as const;

/**
 * Every backdrop the glass materials are shown on below (see the CSS): a
 * plain light and dark page, a bright and a dim vivid background, a
 * picture.
 */
const backdrops = [
  ['light', 'A light page'],
  ['dark', 'A dark page'],
  ['vivid-light', 'A bright background'],
  ['vivid-dark', 'A dim background'],
  ['photo', 'A picture'],
] as const;

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
/** `useBackdropTone`'s example (see the tokens page). */
const backdropToneCode = `import { useRef } from 'react';
import { Symbol, useBackdropTone } from '@mrpelz/uikit-ish';

// A symbol over the app's own backdrop: dark over a bright one, white over
// a dim one, as the page scrolls or resizes.
const Sun = () => {
  const ref = useRef(null);
  const tone = useBackdropTone(ref);

  return (
    <span
      ref={ref}
      style={{ color: tone === 'dim' ? '#fff' : '#000' }}
    >
      <Symbol icon={sfSunMaxFill} />
    </span>
  );
};`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/**
 * The example's sun, live: over the backdrops scrolling under glass (see
 * the tokens page), dark over bright ones, white over dim ones.
 */
const ToneSymbol: FunctionComponent = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const tone = useBackdropTone(ref);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="demo-token-tone-symbol"
      style={{ color: tone === 'dim' ? '#fff' : '#000' }}
    >
      <Symbol icon={sfSunMaxFill} />
    </span>
  );
};

/** `useBackdropTone(ref, options)`: its arguments, and what it returns. */
const backdropToneRows: readonly PropRow[] = [
  [
    'ref',
    '{ current: Element | null }',
    undefined,
    'The element whose backdrop is sampled.',
  ],
  [
    'options.dwell',
    'number',
    code('0'),
    'How long (ms) a new tone must hold before it’s returned. The first one is returned at once.',
  ],
  ['options.enabled', 'boolean', code('true'), 'Whether it samples at all.'],
  [
    'options.within',
    '{ current: Element | null }',
    undefined,
    'An ancestor to sample within, for example the card a label is on, over a tinted surface in it: only what’s painted inside it counts, its own background last. It samples again only as something in it, or around it, changes, not as the page scrolls.',
  ],
  [
    'returns',
    union('bright', 'dim', 'undefined'),
    undefined,
    'The tone behind the element; undefined until it’s known, or while not enabled.',
  ],
];

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const backdropMarkerCode = `import { useRef } from 'react';
import { useBackdropMarker } from '@mrpelz/uikit-ish';

// A video of the night sky, behind glass: dim, though its styles don't
// say so (nothing the sampling can read).
const Night = () => {
  const ref = useRef(null);
  useBackdropMarker(ref, 'dim');

  return <video ref={ref} autoPlay loop muted src="/night.mp4" />;
};`;

const imageBackdropMarkerCode = `import { useRef } from 'react';
import { useImageBackdropMarker } from '@mrpelz/uikit-ish';

// A picture of the app's own, read by its pixels; its caption in the tone
// of the corner it's in.
const Hero = ({ src }) => {
  const ref = useRef(null);
  const { caption } = useImageBackdropMarker(ref, {
    areas: { caption: [0.6, 0.8, 0.4, 0.2] },
    fallback: 'dim',
  });

  return (
    <figure>
      <img ref={ref} alt="" src={src} style={{ objectFit: 'cover' }} />
      <figcaption style={{ color: caption === 'bright' ? '#000' : '#fff' }}>
        Harbor at dusk
      </figcaption>
    </figure>
  );
};`;

const backdropGridCode = `import { useMemo, useRef } from 'react';
import { backdropGridOf, useBackdropMarker } from '@mrpelz/uikit-ish';

// A picture from another site that doesn't allow reading it: marked by a
// preview the app was given (here a canvas, e.g. decoded from a BlurHash).
const Remote = ({ preview, src }) => {
  const ref = useRef(null);
  const grid = useMemo(() => backdropGridOf(preview), [preview]);
  useBackdropMarker(ref, grid);

  return <img ref={ref} alt="" src={src} />;
};`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const resampleCode = `import { resampleBackdrops } from '@mrpelz/uikit-ish';

// The app's theme changes a stylesheet's rule (nothing in the page's
// elements changes): glass over it follows.
const setBackground = (rule, color) => {
  rule.style.backgroundColor = color;
  resampleBackdrops();
};`;

/** `useBackdropMarker(ref, value)`: its arguments. */
const backdropMarkerRows: readonly PropRow[] = [
  [
    'ref',
    '{ current: Element | null }',
    undefined,
    'The element marked: what’s in it is marked too.',
  ],
  [
    'value',
    'BackdropTone | number | (number | null)[] | undefined',
    undefined,
    'A tone, a luminance from 0 to 1, or a grid of them across the element (from backdropGridOf). Left undefined, it isn’t marked.',
  ],
];

/** `useImageBackdropMarker(ref, options)`: its options, and what it returns. */
const imageBackdropMarkerRows: readonly PropRow[] = [
  [
    'ref',
    '{ current: Element | null }',
    undefined,
    'An img, or an element with a background image.',
  ],
  [
    'options.areas',
    'Record<string, [x, y, width, height]>',
    undefined,
    'Areas of the element, in fractions of it, whose tones are returned.',
  ],
  [
    'options.fallback',
    'BackdropTone | number',
    undefined,
    'Its marker while the image can’t be read: still loading, or not allowed by its site.',
  ],
  [
    'returns',
    'Partial<Record<string, BackdropTone>>',
    undefined,
    'Each area’s tone, once the image has been read.',
  ],
];

/** `backdropGridOf(source, options)`: its arguments, and what it returns. */
const backdropGridRows: readonly PropRow[] = [
  [
    'source',
    'CanvasImageSource',
    undefined,
    'What’s drawn: an image, a canvas, an ImageBitmap, a video’s current frame.',
  ],
  [
    'options.box',
    '{ x, y, width, height }',
    'all of it',
    'Where it’s drawn within the element, for an image fitted into it (in px, as width and height below).',
  ],
  [
    'options.width, options.height',
    'number',
    code('1'),
    'The element’s size, for box.',
  ],
  [
    'returns',
    '(number | null)[]',
    undefined,
    'An 8 by 8 grid of luminances, row by row; null where it’s transparent. For useBackdropMarker.',
  ],
];

/** A band of the stage drawn on a canvas, marked dim (see the page). */
const CanvasBand: FunctionComponent = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useBackdropMarker(ref, 'dim');
  useEffect(() => {
    const { current: canvas } = ref;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    canvas.width = 400;
    canvas.height = 300;
    const sky = context.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#05051a');
    sky.addColorStop(1, '#1b1240');
    context.fillStyle = sky;
    context.fillRect(0, 0, 400, 300);
    context.fillStyle = '#fff';
    for (let index = 0; index < 80; index += 1) {
      const size = ((index * 7) % 3) / 2 + 0.5;
      context.fillRect((index * 97) % 400, (index * 61) % 300, size, size);
    }
  }, []);
  return (
    <div className="demo-token-band">
      <canvas
        ref={ref}
        aria-hidden="true"
        className="demo-token-band-media"
      />
      <span
        className="demo-token-band-label"
        style={{ color: '#fff' }}
      >
        A canvas (marked dim)
      </span>
    </div>
  );
};

/**
 * A picture for the stage, the page's own (a `blob:` URL, readable): a
 * bright sky above a dark shore.
 */
const usePicture = () => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    const sky = context.createLinearGradient(0, 0, 0, 200);
    sky.addColorStop(0, '#9fd3ff');
    sky.addColorStop(1, '#fff1d6');
    context.fillStyle = sky;
    context.fillRect(0, 0, 480, 200);
    context.fillStyle = '#fffbe8';
    context.beginPath();
    context.arc(360, 70, 34, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#1d2a1f';
    context.beginPath();
    context.moveTo(0, 210);
    context.quadraticCurveTo(160, 150, 300, 205);
    context.quadraticCurveTo(400, 230, 480, 190);
    context.lineTo(480, 360);
    context.lineTo(0, 360);
    context.fill();
    let made: string | undefined;
    let isCurrent = true;
    canvas.toBlob((blob) => {
      if (!blob || !isCurrent) return;
      made = URL.createObjectURL(blob);
      setUrl(made);
    });
    return () => {
      isCurrent = false;
      if (made) URL.revokeObjectURL(made);
    };
  }, []);
  return url;
};

/**
 * A band of the stage showing a picture, marked by its pixels; its label
 * in the tone of the area it's in (see the page).
 */
const PictureBand: FunctionComponent = () => {
  const url = usePicture();
  const ref = useRef<HTMLImageElement>(null);
  const { label } = useImageBackdropMarker(ref, {
    areas: { label: [0.45, 0.2, 0.55, 0.15] },
  });
  return (
    <div className="demo-token-band">
      {/* (Rendered at once, its source set once it's made: the marker
          follows its source.) */}
      <img
        ref={ref}
        alt=""
        className="demo-token-band-media"
        src={url}
      />
      <span
        className="demo-token-band-label"
        data-place="sky"
        style={{ color: label === 'bright' ? '#000' : '#fff' }}
      >
        A picture (sampled)
      </span>
    </div>
  );
};

const sections: readonly Section[] = [
  ['colors', 'Colors'],
  ['typography', 'Typography'],
  ['materials', 'Materials'],
  ['hooks', 'Hooks'],
];

// How long a copied token shows as such (ms).
const copiedFor = 1200;

/**
 * Copies `var(--token)` to the clipboard: the token copied (for a moment,
 * to show it), and the copy.
 */
const useCopy = (): [
  copied: string | undefined,
  copy: (name: string) => void,
] => {
  const [copied, setCopied] = useState<string | undefined>();

  useEffect(() => {
    if (copied === undefined) return undefined;
    const timeout = setTimeout(() => setCopied(undefined), copiedFor);
    return () => clearTimeout(timeout);
  }, [copied]);

  return [
    copied,
    (name) => {
      navigator.clipboard
        .writeText(`var(${name})`)
        .then(() => setCopied(name))
        .catch(() => undefined);
    },
  ];
};

/**
 * A token's card: its sample, its name (without its prefix), a line below
 * (e.g. its value); pressed, `var(--token)` copied.
 */
const TokenCard: FunctionComponent<{
  children: ReactNode;
  copied: string | undefined;
  note: ReactNode;
  onCopy: (name: string) => void;
  prefix: string;
  token: Token;
}> = ({ children, copied, note, onCopy, prefix, token }) => (
  <button
    className="demo-token-card"
    title={describe(token)}
    type="button"
    onClick={() => onCopy(token.name)}
  >
    {children}
    <span className="demo-token-name">{token.name.slice(prefix.length)}</span>
    <span className="demo-token-note">
      {copied === token.name ? `Copied var(${token.name})` : note}
    </span>
  </button>
);

/** A color in both schemes (each half forced), over its scheme's background. */
const ColorChip: FunctionComponent<{ className?: string; value: string }> = ({
  className = '',
  value,
}) => (
  <span className={`demo-token-chip ${className}`}>
    {(['light', 'dark'] as const).map((scheme) => (
      <span
        key={scheme}
        data-color-scheme={scheme}
        style={{ '--demo-token-color': value } as CSSProperties}
      />
    ))}
  </span>
);

/** Its specimens twice: light and dark, side by side (stacked, narrow). */
const BothSchemes: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => (
  <div className="demo-token-schemes">
    {(['light', 'dark'] as const).map((scheme) => (
      <section
        key={scheme}
        className="demo-token-scheme"
        data-color-scheme={scheme}
      >
        <p className="demo-token-scheme-label">
          {scheme === 'light' ? 'Light' : 'Dark'}
        </p>
        {children}
      </section>
    ))}
  </div>
);

/**
 * `/tokens`: the library's design tokens (the root's custom properties in
 * styles.css, read from it as written), live: colors (and with increased
 * contrast), text styles as specimens, the glass materials each on a
 * backdrop of what it's for; each in both schemes at once. A color
 * pressed, `var(--token)` copied.
 */
export const TokensPage: FunctionComponent = () => {
  const [copied, copy] = useCopy();

  return (
    <div className="demo-page demo-prose demo-tokens-page">
      <nav className="demo-page-nav">
        <a href={publicUrl('./')}>uikit-ish</a> ›{' '}
        <a href={publicUrl('#foundations')}>Foundations</a>
      </nav>
      <h1 className="demo-page-title">Design Tokens</h1>
      <p className="demo-lead">
        The custom properties the library’s stylesheet sets on the root, read
        from it as written and shown live, each in light and dark. Press one to
        copy it as <code>var(--…)</code>, and hover it to see its values.
      </p>
      <Contents sections={sections} />

      <div className="demo-tokens">
        <Heading
          id="colors"
          level={2}
        >
          Colors
        </Heading>
        <p className="demo-tokens-legend">
          <ColorChip value="var(--color-ui-system-gray3)" />
          Each in light and dark, over its scheme’s background. The band below
          shows it with increased contrast.
        </p>
        {colorsByRole.map(([title, roleTokens]) => (
          <section key={title}>
            <h3 className="demo-tokens-subheading">{titleCase(title)}</h3>
            <div className="demo-token-grid">
              {roleTokens.map((token) => {
                const contrast = contrastOf(token);

                return (
                  <TokenCard
                    key={token.name}
                    copied={copied}
                    note={contrast === undefined ? null : 'contrast'}
                    prefix="--color-ui-"
                    token={token}
                    onCopy={copy}
                  >
                    <span className="demo-token-chips">
                      <ColorChip value={`var(${token.name})`} />
                      {contrast === undefined ? null : (
                        <ColorChip
                          className="demo-token-chip-contrast"
                          value={contrast}
                        />
                      )}
                    </span>
                  </TokenCard>
                );
              })}
            </div>
          </section>
        ))}

        <Heading
          id="typography"
          level={2}
        >
          Typography
        </Heading>
        <p>
          The text styles at the default text size: size / line height,
          tracking, weight and emphasized weight. (For the other text sizes, see{' '}
          <PartLink
            component="typography"
            part="Typography"
          />
          ’s <code>textSize</code>.)
        </p>
        <BothSchemes>
          <ol className="demo-token-specimens">
            {textStyles.map((style) => {
              const metric = (name: string) => `--font-ui-${style}-${name}`;
              const font = (weight: string) =>
                ({
                  fontSize: `var(${metric('size')})`,
                  fontVariationSettings: `'wght' var(${metric(weight)})`,
                  fontWeight: `round(down, var(${metric(weight)}), 100)`,
                  letterSpacing: `var(${metric('tracking')})`,
                  lineHeight: `var(${metric('line-height')})`,
                }) as CSSProperties;

              return (
                <li key={style}>
                  <span className="demo-token-specimen">
                    <span style={font('weight')}>{titleOf(style)}</span>{' '}
                    <span
                      className="demo-token-specimen-emphasized"
                      style={font('weight-emphasized')}
                    >
                      Emphasized
                    </span>
                  </span>
                  <span className="demo-token-metrics">
                    <span>
                      {valueOf(metric('size'))} /{' '}
                      {valueOf(metric('line-height'))}
                    </span>
                    <span>{valueOf(metric('tracking'))}</span>
                    <span>
                      {valueOf(metric('weight'))} ·{' '}
                      {valueOf(metric('weight-emphasized'))}
                    </span>
                    <code>{`--font-ui-${style}-*`}</code>
                  </span>
                </li>
              );
            })}
          </ol>
        </BothSchemes>

        <Heading
          id="materials"
          level={2}
        >
          Materials
        </Heading>
        <p>
          Each material on a backdrop that suits what it’s for: a{' '}
          <PartLink
            component="button"
            part="Button.Root"
          />{' '}
          in each glass context (plain, prominent), and the medium material of
          menus and alerts, as a small menu.
        </p>
        <BothSchemes>
          <div className="demo-token-materials">
            {glassContexts.map(([context, backdrop, role]) => (
              <figure
                key={backdrop}
                className="demo-token-material"
              >
                <span
                  className="demo-token-material-stage"
                  data-backdrop={backdrop}
                >
                  <span
                    aria-hidden="true"
                    className="demo-token-material-letters"
                  >
                    Aa
                  </span>
                  {/* (Specimens, doing nothing: enabled all the same, as a
                   button without a click handler isn't, see Button.) */}
                  <span className="demo-token-material-samples">
                    <Button.Root
                      context={context}
                      disabled={false}
                      variant="glass"
                    >
                      Glass
                    </Button.Root>
                    <Button.Root
                      context={context}
                      disabled={false}
                      variant="glass-prominent"
                    >
                      Prominent
                    </Button.Root>
                  </span>
                </span>
                <figcaption>
                  <code>{context}</code>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
            <figure className="demo-token-material">
              <span
                className="demo-token-material-stage"
                data-backdrop="vivid"
              >
                <span
                  aria-hidden="true"
                  className="demo-token-material-letters"
                >
                  Aa
                </span>
                <span className="demo-token-medium uikit-glass-medium">
                  <span>Copy</span>
                  <span>Paste</span>
                  <span>Share…</span>
                </span>
              </span>
              <figcaption>
                <code>medium</code>
                <span>Menus, alerts (by the color scheme)</span>
              </figcaption>
            </figure>
          </div>
        </BothSchemes>
        <h3>On every backdrop</h3>
        <p>
          The same glass, as components use it by default (no context given), on
          each kind of backdrop: a glass{' '}
          <PartLink
            component="button"
            part="Button.Root"
          />
          , a prominent one, and the medium material of panels (a{' '}
          <a href={publicUrl('card')}>Card</a>, a{' '}
          <a href={publicUrl('sheet')}>Sheet</a>, a{' '}
          <a href={publicUrl('sidebar')}>Sidebar</a>).
        </p>
        <BothSchemes>
          <div className="demo-token-materials">
            {backdrops.map(([backdrop, role]) => (
              <figure
                key={backdrop}
                className="demo-token-material"
              >
                <span
                  className="demo-token-material-stage"
                  data-backdrop={backdrop}
                >
                  <span
                    aria-hidden="true"
                    className="demo-token-material-letters"
                  >
                    Aa
                  </span>
                  <span className="demo-token-material-samples demo-token-material-column">
                    <span className="demo-token-material-samples">
                      <Button.Root
                        aria-label="Like"
                        disabled={false}
                        shape="circle"
                        variant="glass"
                      >
                        <Button.Icon>
                          <Symbol icon={sfHeartFill} />
                        </Button.Icon>
                      </Button.Root>
                      <Button.Root
                        disabled={false}
                        variant="glass"
                      >
                        <Button.Icon>
                          <Symbol icon={sfPlayFill} />
                        </Button.Icon>
                        <Button.Label>Glass</Button.Label>
                      </Button.Root>
                      <Button.Root
                        disabled={false}
                        variant="glass-prominent"
                      >
                        <Button.Icon>
                          <Symbol icon={sfSquareAndArrowUp} />
                        </Button.Icon>
                        <Button.Label>Prominent</Button.Label>
                      </Button.Root>
                    </span>
                    <span className="demo-token-panel uikit-glass-medium uikit-glass-panel">
                      <Symbol icon={sfLightbulbLedFill} />
                      <strong>Panel</strong>
                      <span className="demo-token-panel-detail">
                        Medium material
                      </span>
                    </span>
                  </span>
                </span>
                <figcaption>
                  <code>{backdrop}</code>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </BothSchemes>
        <h3>Scrolling under it</h3>
        <p>
          The backdrops again, scrolling under glass that stays put: glass
          buttons and a <a href={publicUrl('card')}>Card</a> whose context is{' '}
          <code>adaptive</code>, following what’s behind them as it changes, and
          a panel of the medium material, by the color scheme alone. Last come a
          canvas, marked dim, and a picture, read by its pixels (see{' '}
          <a href="#hooks">Hooks</a>).
        </p>
        <BothSchemes>
          <div className="demo-token-scroll-stage">
            <div className="demo-token-scroll-bands">
              {backdrops.map(([backdrop, role]) => (
                <div
                  key={backdrop}
                  className="demo-token-band"
                  data-backdrop={backdrop}
                >
                  <span
                    aria-hidden="true"
                    className="demo-token-material-letters"
                  >
                    Aa
                  </span>
                  <span className="demo-token-band-label">{role}</span>
                </div>
              ))}
              <CanvasBand />
              <PictureBand />
            </div>
            <div className="demo-token-scroll-bar">
              <ToneSymbol />
              <Button.Root
                aria-label="Back"
                context="adaptive"
                disabled={false}
                shape="circle"
                variant="glass"
              >
                <Button.Icon>
                  <Symbol icon={sfChevronBackward} />
                </Button.Icon>
              </Button.Root>
              <Button.Root
                aria-label="More"
                context="adaptive"
                disabled={false}
                shape="circle"
                variant="glass"
              >
                <Button.Icon>
                  <Symbol icon={sfEllipsis} />
                </Button.Icon>
              </Button.Root>
            </div>
            <div
              className="demo-token-scroll-bar"
              data-edge="end"
            >
              <span className="demo-token-panel uikit-glass-medium uikit-glass-panel">
                <Symbol icon={sfLightbulbLedFill} />
                <strong>Panel</strong>
                <span className="demo-token-panel-detail">By the scheme</span>
              </span>
              <div className="demo-token-adaptive-card">
                <Card.Root context="adaptive">
                  <Card.Symbol>
                    <Symbol icon={sfLightbulbLedFill} />
                  </Card.Symbol>
                  <Card.Title>Card</Card.Title>
                  <Card.Value>Adaptive</Card.Value>
                </Card.Root>
              </div>
            </div>
          </div>
        </BothSchemes>
        <h3>Following what’s behind</h3>
        <p>
          Every glass part takes a <code>context</code>: <code>bright</code>{' '}
          draws light glass, <code>dim</code> dark glass, and{' '}
          <code>adaptive</code> picks between them by what’s behind it. Left
          out, the color scheme picks. A surface (a{' '}
          <a href={publicUrl('card')}>Card</a>, a{' '}
          <a href={publicUrl('sheet')}>Sheet</a>, a{' '}
          <a href={publicUrl('menu')}>Menu</a>) takes its content along: it’s
          drawn in the matching color scheme, as are the menus and popovers
          opened from it.
        </p>
        <p>
          The hooks behind it, for an app’s own elements, are below (see{' '}
          <a href="#hooks">Hooks</a>).
        </p>

        <Heading
          id="hooks"
          level={2}
        >
          Hooks
        </Heading>
        <p>
          For glass that follows what’s behind it, and an app’s own elements
          doing the same: reading the tone of what’s behind, and telling it
          where it can’t be read.
        </p>
        <p>
          Each hook takes its element as it’s first rendered: an element that
          only appears later (behind a condition) isn’t picked up. Render the
          element from the start, or put the hook in a component rendered
          together with it.
        </p>
        <Heading
          id={sectionId('useBackdropTone')}
          level={3}
        >
          <code>useBackdropTone</code>
        </Heading>
        <ul>
          <li>
            The sampling behind <code>adaptive</code>, for an app’s own
            elements, for example symbols or captions over a picture. It tells
            whether what’s behind an element is bright or dim.
          </li>
          <li>
            It reads the colors the page paints behind the element (backgrounds
            and their gradients) at a few points across it. It samples again as
            anything scrolls or resizes, as the page changes (a class or style,
            for example a card switched on, an element added or removed, the
            color scheme), and every frame while something transitions or
            animates. It can’t read images, videos or canvases: behind those,
            the tone stays as it was.
          </li>
          <li>
            Between bright and dim, it keeps its last tone, so it doesn’t
            flicker at an edge. With a <code>dwell</code>, a new tone must last
            that long before it’s returned.
          </li>
          <li>
            While a{' '}
            <PartLink
              component="navigation"
              part="Navigation.Stack"
            />{' '}
            moves between pages, its pages are inert. An inert or hidden element
            isn’t sampled and keeps its tone, since what’s behind it can’t be
            read right, so tones stay put while the pages move.
          </li>
          <li>
            With <code>within</code>, it samples on a surface: only what’s
            painted inside the given ancestor, for example a card of the app’s
            own with a tinted surface in it, its text sampled on the card alone.
            It isn’t needed where the colors are known: a{' '}
            <PartLink
              component="card"
              part="Card.Root"
            />{' '}
            doesn’t sample its parts.
          </li>
          <li>
            Above, the sun at the top of the backdrops that scroll under glass
            takes its color from it: dark over a bright backdrop, white over a
            dim one.
          </li>
        </ul>
        <CodeView code={backdropToneCode} />
        <h4>Arguments and return value</h4>
        <PropsTable rows={backdropToneRows} />

        <Heading
          id={sectionId('useBackdropMarker')}
          level={3}
        >
          <code>useBackdropMarker</code>
        </Heading>
        <ul>
          <li>
            Tells the sampling what an element shows where it can’t read it: a
            video, a canvas, a map. Give it a tone, a luminance from 0 to 1, or
            a grid of them (see <code>backdropGridOf</code>).
          </li>
          <li>
            What’s in the element counts too, for example a map’s tiles in a
            marked container. Changing the value, glass over it follows at once,
            without anything scrolling. Left <code>undefined</code>, the element
            is read as painted again.
          </li>
          <li>
            Above, the dark canvas among the backdrops is marked dim: the glass
            over it turns dark, though nothing in its styles says so.
          </li>
        </ul>
        <CodeView code={backdropMarkerCode} />
        <h4>Arguments</h4>
        <PropsTable rows={backdropMarkerRows} />

        <Heading
          id={sectionId('useImageBackdropMarker')}
          level={3}
        >
          <code>useImageBackdropMarker</code>
        </Heading>
        <ul>
          <li>
            Marks an image by its pixels: an <code>img</code>, or an element
            with a background image. It loads a small copy once and reads it as
            the image is drawn in the element (<code>object-fit</code>,{' '}
            <code>background-size</code>), again as it resizes or its source
            changes.
          </li>
          <li>
            The copy is requested with CORS: the page’s own images can be read,
            another site’s only if it allows that. Without it, nothing can be
            read at all, and the <code>fallback</code> is used, if given.
          </li>
          <li>
            Its <code>areas</code> return their tones, for the app’s own text
            over the image. Above, the picture among the backdrops is sampled;
            its label takes the tone of the area it sits in.
          </li>
        </ul>
        <CodeView code={imageBackdropMarkerCode} />
        <h4>Options and return value</h4>
        <PropsTable rows={imageBackdropMarkerRows} />

        <Heading
          id={sectionId('backdropGridOf')}
          level={3}
        >
          <code>backdropGridOf</code>
        </Heading>
        <ul>
          <li>
            Turns anything a canvas can draw (an image, a canvas, an{' '}
            <code>ImageBitmap</code>) into a grid for{' '}
            <code>useBackdropMarker</code>. For images the library can’t load
            itself: an app draws its own preview of it (for example one decoded
            from a BlurHash it was given) and marks the image with its grid.
          </li>
          <li>
            It reads pixels, which is costly: once per image and size, not as
            anything moves.
          </li>
        </ul>
        <CodeView code={backdropGridCode} />
        <h4>Arguments and return value</h4>
        <PropsTable rows={backdropGridRows} />

        <Heading
          id={sectionId('resampleBackdrops')}
          level={3}
        >
          <code>resampleBackdrops</code>
        </Heading>
        <ul>
          <li>
            Samples every element’s backdrop again, and has image markers read
            their images again. The sampling follows the page’s changes by
            itself (see <code>useBackdropTone</code>); this is for what it can’t
            see, for example a stylesheet’s rule changed by script, or an image
            replaced at the same address.
          </li>
          <li>
            It takes nothing and returns nothing. Calling it more than once in a
            frame samples once.
          </li>
        </ul>
        <CodeView code={resampleCode} />
      </div>
    </div>
  );
};
