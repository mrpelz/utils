import '../typography/sizes.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  ReactNode,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

import type { TextSize } from '../typography/main.js';
import { cn, type ColorScheme, withStyle } from '../utils/main.js';
import type {
  SettingsPortalProps,
  SettingsProviderProps,
  SettingsValues,
} from './props.js';
import { regionOfTimeZone } from './region.js';

export type {
  SettingsContrast,
  SettingsPortalProps,
  SettingsProviderProps,
  SettingsValues,
} from './props.js';

// Settings: each the nearest provider's override, else the system's, else
// the default. The system's apply within providers only (an app's root
// provider applies them across it); outside one, the defaults, but for the
// color scheme, languages, locale and region, which the platform follows on
// its own (`color-scheme: light dark`, `navigator.languages`, `Intl`'s
// defaults). For script, in context (`useSettings`); for the stylesheets,
// as attributes on a provider's element (`display: contents`) and on its
// portals' (see `useSettingsPortalProps`, as they're outside it), the
// nearest winning, and media queries scoped to providers (see styles.css):
// not style queries, which don't apply on iOS.

const keys = [
  'boldText',
  'colorScheme',
  'contrast',
  'differentiateWithoutColor',
  'languages',
  'locale',
  'reducedMotion',
  'reducedTransparency',
  'region',
  'textSize',
] as const satisfies readonly (keyof SettingsValues)[];

type Key = (typeof keys)[number];

/** Overrides: a key with a value, overridden; with `undefined`, reset. */
type Overrides = Partial<SettingsValues>;

const defaults: SettingsValues = {
  boldText: false,
  colorScheme: 'light',
  contrast: 'standard',
  differentiateWithoutColor: false,
  languages: ['en'],
  locale: 'en',
  reducedMotion: false,
  reducedTransparency: false,
  region: undefined,
  textSize: 'large',
};

// The system's, by media queries.
const queries = {
  colorScheme: '(prefers-color-scheme: dark)',
  contrast: '(prefers-contrast: more), (forced-colors: active)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  reducedTransparency: '(prefers-reduced-transparency: reduce)',
} as const satisfies Partial<Record<Key, string>>;

const noSystem: Partial<SettingsValues> = {};
let system: { key: string; values: Partial<SettingsValues> } | undefined;

// The system's languages: the browser's, ranked (not the document's
// `lang`: the content's language, not the user's); its region, the time
// zone's (read at first use, and again by `refreshSettings`: the time zone
// has no event of its own).
const systemLanguages = (): readonly string[] | undefined => {
  if (navigator.languages.length > 0) return navigator.languages;
  return navigator.language ? [navigator.language] : undefined;
};
let zoneRegion: { value: string | undefined } | undefined;

/**
 * The system's text size, by its body text's size (the text sizes' each
 * its own, see Typography): where the browser has it (`font:
 * -apple-system-body`, WebKit's: the system's text size), else none. Read
 * at first use, and again by `refreshSettings` (it has no event).
 */
const textSizes: Record<number, TextSize> = {
  14: 'xSmall',
  15: 'small',
  16: 'medium',
  17: 'large',
  19: 'xLarge',
  21: 'xxLarge',
  23: 'xxxLarge',
  28: 'ax1',
  33: 'ax2',
  40: 'ax3',
  47: 'ax4',
  53: 'ax5',
};
type BodyText = { textSize?: TextSize };
let bodyText: { value: BodyText } | undefined;
/**
 * The system's body text: its size (as a text size), where the browser
 * reports it. (Not its weight: WebKit doesn't report bold text there,
 * measured on a device; bold text has no system signal.)
 */
const systemBodyText = (): BodyText => {
  const probe = document.createElement('span');
  probe.style.font = '-apple-system-body';
  // (Not a font the browser has: not set.)
  if (probe.style.font === '') return {};
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.documentElement.append(probe);
  const { fontSize } = getComputedStyle(probe);
  probe.remove();
  return { textSize: textSizes[Math.round(Number.parseFloat(fontSize))] };
};

/** The system's settings (the same object until they change). */
const getSystem = (): Partial<SettingsValues> => {
  const [isDark, isMore, isReducedMotion, isReducedTransparency] =
    Object.values(queries).map((query) => matchMedia(query).matches);
  zoneRegion ??= { value: regionOfTimeZone() };
  bodyText ??= { value: systemBodyText() };
  const languages = systemLanguages();
  const region = zoneRegion.value;
  const { textSize } = bodyText.value;
  const key = [
    isDark,
    isMore,
    isReducedMotion,
    isReducedTransparency,
    languages?.join('|'),
    region,
    textSize,
  ].join(',');
  if (system?.key !== key) {
    system = {
      key,
      values: {
        colorScheme: isDark ? 'dark' : 'light',
        contrast: isMore ? 'more' : 'standard',
        languages,
        reducedMotion: isReducedMotion,
        reducedTransparency: isReducedTransparency,
        region,
        textSize,
      },
    };
  }
  return system.values;
};

// Everything reading the system's settings (`useSettings`), told as they
// change: one set of listeners for all of them (not one each, as many
// components read them: a card's value, a slider, a date picker), while
// any reads them.
const changeListeners = new Set<() => void>();
let stopListening: (() => void) | undefined;

const onSystemChange = () => {
  for (const listener of changeListeners) listener();
};

const listen = () => {
  const lists = Object.values(queries).map((query) => matchMedia(query));
  for (const list of lists) list.addEventListener('change', onSystemChange);
  addEventListener('languagechange', onSystemChange);
  return () => {
    for (const list of lists) {
      list.removeEventListener('change', onSystemChange);
    }
    removeEventListener('languagechange', onSystemChange);
  };
};

/**
 * Reads the system's settings that have no event of their own again: the
 * time zone, for the guessed `region` (e.g. after the device moved to
 * another one), and the text size (e.g. changed while the app was in the
 * background). Providers and `useSettings` follow.
 */
export const refreshSettings = (): void => {
  zoneRegion = undefined;
  bodyText = undefined;
  onSystemChange();
};

const subscribe = (onChange: () => void) => {
  changeListeners.add(onChange);
  stopListening ??= listen();
  return () => {
    changeListeners.delete(onChange);
    if (changeListeners.size > 0) return;
    stopListening?.();
    stopListening = undefined;
  };
};

/** A language tag's region, if it names one. */
const regionOf = (tag: string) => {
  try {
    return new Intl.Locale(tag).region;
  } catch {
    return undefined;
  }
};

/** A language tag with another region (as it is, if it can't be). */
const withRegion = (tag: string, region: string | undefined) => {
  if (region === undefined) return tag;
  try {
    return new Intl.Locale(tag, { region }).toString();
  } catch {
    return tag;
  }
};

/**
 * The languages, locale and region (see `SettingsValues`): the locale a
 * given one, else the first preferred language; its region a given one,
 * then a given locale's own, then the time zone's, then the language's
 * own.
 */
const localeOf = (
  overrides: Overrides,
  systemValues: Partial<SettingsValues>,
) => {
  const languages =
    overrides.languages ?? systemValues.languages ?? defaults.languages;
  const given = overrides.locale;
  const base = given ?? languages[0] ?? defaults.locale;
  const region =
    overrides.region ??
    (given === undefined ? undefined : regionOf(given)) ??
    systemValues.region ??
    regionOf(base);
  return { languages, locale: withRegion(base, region), region };
};

/** A language tag, canonical and lowercase (none if it isn't one). */
const canonicalTag = (tag: string) => {
  try {
    return Intl.getCanonicalLocales(tag)[0]?.toLowerCase();
  } catch {
    return undefined;
  }
};

/** A language tag's language (e.g. `en` of `en-GB`). */
const languageOf = (tag: string) => tag.split('-')[0];

/**
 * The best of an app's translations (`supported`, language tags) for the
 * preferred `languages` (ranked, e.g. the settings', see `useLanguage`):
 * for each, in order, the same tag, else it shortened (`en-GB`, then
 * `en`), else the same language with another region (`en-GB` for
 * `en-US`), before the next preferred one; none if nothing matches.
 */
export const matchLanguage = (
  supported: readonly string[],
  languages: readonly string[],
): string | undefined => {
  const candidates = supported.map((tag) => [tag, canonicalTag(tag)] as const);
  const find = (match: (candidate: string) => boolean) =>
    candidates.find(
      ([, candidate]) => candidate !== undefined && match(candidate),
    )?.[0];
  for (const preferred of languages) {
    const wanted = canonicalTag(preferred);
    if (wanted === undefined) continue;
    const parts = wanted.split('-');
    for (let length = parts.length; length > 0; length -= 1) {
      const shortened = parts.slice(0, length).join('-');
      const found = find((candidate) => candidate === shortened);
      if (found !== undefined) return found;
    }
    const sameLanguage = find(
      (candidate) => languageOf(candidate) === languageOf(wanted),
    );
    if (sameLanguage !== undefined) return sameLanguage;
  }
  return undefined;
};

const SettingsContext = createContext<Overrides>({});

/** Whether it's within a provider (see `Provider`): the system's apply. */
const InProviderContext = createContext(false);

/**
 * Whether it's within a `Settings.Provider` (the system's settings apply
 * there only, see above): e.g. Viewport's, marking the root.
 */
export const useIsInSettingsProvider = (): boolean =>
  useContext(InProviderContext);

/** The system's settings the platform follows anyway (see above). */
const nativeKeys = ['colorScheme', 'languages', 'locale', 'region'] as const;

/**
 * The settings where it's rendered: each the nearest provider's override,
 * else the system's, else the default (see `Settings.Provider`). A
 * component's own props win over them (e.g. a switch's `onOffLabels`).
 */
export const useSettings = (): SettingsValues => {
  const overrides = useContext(SettingsContext);
  const isInProvider = useContext(InProviderContext);
  const allSystem = useSyncExternalStore(subscribe, getSystem, () => noSystem);

  return useMemo(() => {
    // (Outside a provider, only those the platform follows anyway.)
    const systemValues = isInProvider
      ? allSystem
      : Object.fromEntries(nativeKeys.map((key) => [key, allSystem[key]]));
    return {
      ...Object.fromEntries(
        keys.map((key) => [
          key,
          overrides[key] ?? systemValues[key] ?? defaults[key],
        ]),
      ),
      ...localeOf(overrides, systemValues),
    } as SettingsValues;
  }, [allSystem, isInProvider, overrides]);
};

/**
 * The app's translation for where it's rendered: the best of its
 * `supported` ones (language tags) for the settings' preferred languages
 * (see `matchLanguage`), else its first.
 */
export const useLanguage = <T extends string>(
  supported: readonly T[],
): T | undefined => {
  const { languages } = useSettings();
  const supportedKey = supported.join('|');
  return useMemo(
    () =>
      (matchLanguage(supported, languages) as T | undefined) ?? supported[0],
    // (By its tags, not the array: e.g. given inline.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [languages, supportedKey],
  );
};

/**
 * A component's locale: its own (`locale` given), else the settings' (see
 * `SettingsValues`' `locale`).
 */
export const useLocale = <T extends Intl.LocalesArgument>(
  own: T | undefined,
): string | T => {
  const { locale } = useSettings();
  return own ?? locale;
};

/** A boolean setting as an attribute's value (none: not set). */
const booleanAttribute = (value: boolean | undefined) =>
  value === undefined ? undefined : (String(value) as 'false' | 'true');

/**
 * The settings the stylesheets follow, as attributes on an element (see
 * styles.css; the nearest one's wins): those given (a provider's
 * overrides, or its portal's), `false` too (within an outer `true`).
 */
const attributesOf = (values: Partial<SettingsValues>) => ({
  'data-uikit-bold-text': booleanAttribute(values.boldText),
  'data-uikit-contrast': values.contrast,
  'data-uikit-differentiate-without-color': booleanAttribute(
    values.differentiateWithoutColor,
  ),
  'data-uikit-reduced-motion': booleanAttribute(values.reducedMotion),
  'data-uikit-reduced-transparency': booleanAttribute(
    values.reducedTransparency,
  ),
  'data-uikit-text-size': values.textSize,
});

/**
 * The props of a portal opened within providers: their overrides as custom
 * properties (and its color scheme), on the portal (outside their elements,
 * e.g. in the body); without any, its marker alone (the system's settings
 * applying in it, as within its providers). Outside providers, none.
 * Spread by the library's portals (Menu's, Popover's, …).
 */
export const useSettingsPortalProps = (): SettingsPortalProps => {
  const overrides = useContext(SettingsContext);
  const isInProvider = useContext(InProviderContext);
  // (The text size and bold text as where it was opened, always: no media
  // query has the system's, see `Provider`.)
  const { boldText, textSize } = useSettings();

  return useMemo(
    () =>
      isInProvider
        ? {
            'data-color-scheme': overrides.colorScheme,
            ...attributesOf({ ...overrides, boldText, textSize }),
            'data-uikit-settings': '',
            lang: overrides.languages?.[0],
          }
        : {},
    [boldText, isInProvider, overrides, textSize],
  );
};

/**
 * A provider's own settings (given, even as `undefined`), as a key: JSON,
 * `null` for a reset (JSON has no `undefined`).
 */
const ownSettingsKey = (props: Partial<SettingsValues>) =>
  JSON.stringify(
    keys
      .filter((key) => Object.hasOwn(props, key))
      .map((key) => [key, props[key] ?? null]),
  );

/** A provider's overrides: its outer provider's, then its own (by key). */
const useOverrides = (outer: Overrides, ownKey: string): Overrides =>
  useMemo(
    () => ({
      ...outer,
      ...Object.fromEntries(
        (JSON.parse(ownKey) as [Key, unknown][]).map(([key, value]) => [
          key,
          value ?? undefined,
        ]),
      ),
    }),
    [outer, ownKey],
  );

/**
 * Settings for what's within it (see `SettingsProviderProps`): a
 * `display: contents` element (or `render`'s, as it's laid out), its
 * overrides on it as attributes, for the stylesheets, and in context, for
 * `useSettings`. Nested, an inner provider overrides an outer one's,
 * setting by setting.
 */
const Provider = forwardRef<HTMLDivElement, SettingsProviderProps>(
  ({ className, render, style, ...props }, ref) => {
    const outer = useContext(SettingsContext);
    // (Given, even as `undefined`: its own.)
    const own = keys.filter((key) => Object.hasOwn(props, key));
    const ownKey = ownSettingsKey(props);
    const elementProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !(keys as readonly string[]).includes(key),
      ),
    );

    const overrides = useOverrides(outer, ownKey);
    // Its text size and bold text, on its element: the outermost
    // provider's (its own, or the system's, detected: no media query has
    // them), a nested one's given (or reset, to the system's); else
    // inherited.
    const isOutermost = !useContext(InProviderContext);
    const systemValues = useSyncExternalStore(
      subscribe,
      getSystem,
      () => noSystem,
    );
    const detected = <K extends 'boldText' | 'textSize'>(key: K) =>
      isOutermost || own.includes(key) || overrides[key] !== undefined
        ? (overrides[key] ?? systemValues[key] ?? defaults[key])
        : undefined;

    const element = useRender({
      defaultTagName: 'div',
      props: {
        ...elementProps,
        // (`render`'s element a box of its own: e.g. an app's root, laid
        // out as it is.)
        className:
          render === undefined ? cn('uikit-settings', className) : className,
        'data-color-scheme': own.includes('colorScheme')
          ? props.colorScheme
          : undefined,
        ...attributesOf({
          ...overrides,
          boldText: detected('boldText'),
          textSize: detected('textSize'),
        }),
        // (For the stylesheets: what's within a provider, and directly
        // within it, see styles.css.)
        'data-uikit-settings': '',
        // (Its languages given: its first, for what's within it; not its
        // formatting locale, which isn't the content's language.)
        lang: own.includes('languages') ? props.languages?.[0] : undefined,
        // (Its color scheme reset: the system's again, within an outer
        // provider's; one given, by its attribute, see styles.css.)
        style:
          own.includes('colorScheme') && props.colorScheme === undefined
            ? withStyle({ colorScheme: 'light dark' }, style)
            : style,
      },
      ref,
      render,
    });

    return (
      <InProviderContext.Provider value>
        <SettingsContext.Provider value={overrides}>
          {element}
        </SettingsContext.Provider>
      </InProviderContext.Provider>
    );
  },
);

/**
 * Its children in a color scheme of their own (internal: a glass surface's
 * tone, see Glass' `useGlassScheme`): an override of the nearest
 * provider's, as a provider's own, for `useSettings` and the portals opened
 * within; the element showing it sets its CSS (see Glass' `colorSchemeStyle`).
 * Without one, as it is.
 */
export const ColorSchemeScope: FunctionComponent<{
  children?: ReactNode;
  colorScheme: ColorScheme | undefined;
}> = ({ children, colorScheme }) => {
  const outer = useContext(SettingsContext);
  const value = useMemo(
    () => (colorScheme === undefined ? outer : { ...outer, colorScheme }),
    [colorScheme, outer],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const Settings = {
  Provider,
};
