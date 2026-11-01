import '../../../components/glass/style.css';
import './style.css';

import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

// (The stylesheet as written, its text: `!` skips the configured loaders,
// not the rules' types, as `!!` would, see parse.ts.)
import tokensCss from '!../../../styles.css' with { type: 'text' };

import { Button, type ColorScheme } from '../../../components/index.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { parseTokens, type Token, type TokenGroup } from './parse.js';

const groups = parseTokens(tokensCss as string);
const tokens = groups.flatMap((group) => group.tokens);

/** The tokens whose names start with `prefix`. */
const withPrefix = (prefix: string) =>
  tokens.filter(({ name }) => name.startsWith(prefix));

/** The groups with tokens starting with `prefix`, those tokens only. */
const groupsWithPrefix = (prefix: string): TokenGroup[] =>
  groups
    .map((group) => ({
      ...group,
      tokens: group.tokens.filter(({ name }) => name.startsWith(prefix)),
    }))
    .filter((group) => group.tokens.length > 0);

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

// The glass contexts: each on a backdrop of what it's for (light content,
// dark content, an app's background, bright or dim), and what it's for.
const glassContexts = [
  ['bright', 'light', 'On light content'],
  ['dim', 'dark', 'On dark content'],
  ['background-bright', 'vivid-light', 'On an app’s bright background'],
  ['background-dim', 'vivid-dark', 'On an app’s dim background'],
] as const;

const sections: readonly Section[] = [
  ['colors', 'Colors'],
  ['typography', 'Typography'],
  ['materials', 'Materials'],
  ['shadows', 'Shadows'],
  ['safe-areas', 'Safe areas'],
  ['dimensions', 'Dimensions'],
  ['durations', 'Durations and transitions'],
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

/** A group's comment (the stylesheet's), its tokens listed. */
const GroupTokens: FunctionComponent<{ group: TokenGroup }> = ({
  group: { description, title, tokens: groupTokens },
}) => (
  <details className="demo-token-group">
    <summary>
      {title}
      <span className="demo-token-group-count">{groupTokens.length}</span>
    </summary>
    {description === '' ? null : (
      <p className="demo-token-description">{description}</p>
    )}
    <dl className="demo-token-table">
      {groupTokens.map((token) => (
        <div key={token.name}>
          <dt>
            <code>{token.name}</code>
          </dt>
          <dd>
            <code>{token.value}</code>
            {token.variants.map(({ condition, value }) => (
              <span key={condition}>
                <span>{condition}</span> <code>{value}</code>
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  </details>
);

/**
 * `/tokens`: the library's design tokens (the root's custom properties in
 * styles.css, read from it as written), live: colors in both schemes at
 * once (and with increased contrast); text styles as specimens, the glass
 * materials each on a backdrop of what it's for, shadows (in the scheme
 * chosen); safe areas. A token pressed, `var(--token)` copied.
 */
export const TokensPage: FunctionComponent = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>();
  const [copied, copy] = useCopy();

  return (
    <div className="demo-page demo-prose demo-tokens-page">
      <nav className="demo-page-nav">
        <a href={publicUrl('./')}>uikit-ish</a> › Design tokens
      </nav>
      <h1 className="demo-page-title">Design tokens</h1>
      <p className="demo-lead">
        The custom properties the library’s stylesheet sets on the root, read
        from it as written and shown live. Press one to copy it as{' '}
        <code>var(--…)</code>; hover it for its values.
      </p>
      <Contents sections={sections} />
      <label className="demo-setting demo-tokens-scheme">
        Color Scheme (text styles, materials, shadows){' '}
        <select
          name="colorScheme"
          value={colorScheme ?? ''}
          onChange={({ currentTarget }) =>
            setColorScheme((currentTarget.value as ColorScheme) || undefined)
          }
        >
          <option value="">[auto]</option>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>

      <div className="demo-tokens">
        <Heading
          id="colors"
          level={2}
        >
          Colors
        </Heading>
        <p className="demo-tokens-legend">
          <ColorChip value="var(--color-ui-system-gray3)" />
          Each in light and dark, over its scheme’s background; a band below:
          with increased contrast.
        </p>
        {colorsByRole.map(([title, roleTokens]) => (
          <section key={title}>
            <h3 className="demo-tokens-subheading">{title}</h3>
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
          tracking, weight and emphasized weight. (The other text sizes:{' '}
          <PartLink
            component="typography"
            part="Typography"
          />
          ’s <code>textSize</code>.)
        </p>
        <ol
          className="demo-token-specimens"
          data-color-scheme={colorScheme}
        >
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
                    {valueOf(metric('size'))} / {valueOf(metric('line-height'))}
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

        <Heading
          id="materials"
          level={2}
        >
          Materials
        </Heading>
        <p>
          Each material on a backdrop of what it’s for: a{' '}
          <PartLink
            component="button"
            part="Button.Root"
          />{' '}
          in each glass context (plain, prominent), and the medium material of
          menus and alerts, as a small menu. Their tokens below, by the
          stylesheet’s groups.
        </p>
        <div
          className="demo-token-materials"
          data-color-scheme={colorScheme}
        >
          {glassContexts.map(([context, backdrop, role]) => (
            <figure
              key={context}
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
        {groupsWithPrefix('--glass-ui-').map((group) => (
          <GroupTokens
            key={group.title}
            group={group}
          />
        ))}

        <Heading
          id="shadows"
          level={2}
        >
          Shadows
        </Heading>
        <div
          className="demo-token-grid demo-token-shadows"
          data-color-scheme={colorScheme}
        >
          {withPrefix('--shadow-ui-').map((token) => (
            <TokenCard
              key={token.name}
              copied={copied}
              note={null}
              prefix="--shadow-ui-"
              token={token}
              onCopy={copy}
            >
              <span className="demo-token-shadow-stage">
                <span
                  className="demo-token-shadow"
                  style={{ boxShadow: `var(${token.name})` }}
                />
              </span>
            </TokenCard>
          ))}
        </div>

        <Heading
          id="safe-areas"
          level={2}
        >
          Safe areas
        </Heading>
        <p>
          The insets kept clear of a camera cutout, the home indicator and
          rounded corners: the device’s, or an app’s (e.g. a frame emulating a
          device). Here, this device’s:
        </p>
        <div className="demo-token-safe-areas">
          {withPrefix('--uikit-safe-area-').map((token) => (
            <span
              key={token.name}
              className="demo-token-safe-area"
              data-edge={token.name.slice('--uikit-safe-area-inset-'.length)}
              title={describe(token)}
            >
              <code>{token.name.slice('--uikit-safe-area-'.length)}</code>
              <span
                className="demo-token-safe-area-value"
                style={
                  {
                    '--demo-token-inset': `var(${token.name})`,
                  } as CSSProperties
                }
              />
            </span>
          ))}
        </div>

        <Heading
          id="dimensions"
          level={2}
        >
          Dimensions
        </Heading>
        <p className="demo-tokens-pending">
          Not tokens yet: sizes, heights and spacing are set per component (some
          as their own custom properties). Their common scale comes with the
          text size setting, and shows here then.
        </p>

        <Heading
          id="durations"
          level={2}
        >
          Durations and transitions
        </Heading>
        <p className="demo-tokens-pending">
          Not tokens yet: each component times its own transitions. They come
          with the reduced motion setting, and show here then, each with a
          demonstration.
        </p>
      </div>
    </div>
  );
};
