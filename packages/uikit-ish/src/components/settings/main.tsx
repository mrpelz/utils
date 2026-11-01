import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

import { cn, withStyle } from '../utils/main.js';
import type {
  SettingsPortalProps,
  SettingsProviderProps,
  SettingsValues,
} from './props.js';

export type {
  SettingsContrast,
  SettingsPortalProps,
  SettingsProviderProps,
  SettingsValues,
} from './props.js';

// Settings: each the nearest provider's override, else the system's (a
// media query's, live), else the default. For CSS, as custom properties
// (inherited: the nearest provider's wins, see style.css): a provider sets
// those it overrides on its element (`display: contents`), a portal those
// overridden where it's opened (see `useSettingsPortalProps`), as it's
// outside that element.

const keys = [
  'colorScheme',
  'contrast',
  'differentiateWithoutColor',
  'reducedMotion',
  'reducedTransparency',
  'textSize',
] as const satisfies readonly (keyof SettingsValues)[];

type Key = (typeof keys)[number];

/** Overrides: a key with a value, overridden; with `undefined`, reset. */
type Overrides = Partial<SettingsValues>;

const defaults: SettingsValues = {
  colorScheme: 'light',
  contrast: 'standard',
  differentiateWithoutColor: false,
  reducedMotion: false,
  reducedTransparency: false,
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

/** The system's settings (the same object until they change). */
const getSystem = (): Partial<SettingsValues> => {
  const [isDark, isMore, isReducedMotion, isReducedTransparency] =
    Object.values(queries).map((query) => matchMedia(query).matches);
  const key = [isDark, isMore, isReducedMotion, isReducedTransparency].join(
    ',',
  );
  if (system?.key !== key) {
    system = {
      key,
      values: {
        colorScheme: isDark ? 'dark' : 'light',
        contrast: isMore ? 'more' : 'standard',
        reducedMotion: isReducedMotion,
        reducedTransparency: isReducedTransparency,
      },
    };
  }
  return system.values;
};

const subscribe = (onChange: () => void) => {
  const lists = Object.values(queries).map((query) => matchMedia(query));
  for (const list of lists) list.addEventListener('change', onChange);
  return () => {
    for (const list of lists) list.removeEventListener('change', onChange);
  };
};

const SettingsContext = createContext<Overrides>({});

/**
 * The settings where it's rendered: each the nearest provider's override,
 * else the system's, else the default (see `Settings.Provider`). A
 * component's own props win over them (e.g. a switch's `onOffLabels`).
 */
export const useSettings = (): SettingsValues => {
  const overrides = useContext(SettingsContext);
  const systemValues = useSyncExternalStore(
    subscribe,
    getSystem,
    () => noSystem,
  );

  return useMemo(
    () =>
      Object.fromEntries(
        keys.map((key) => [
          key,
          overrides[key] ?? systemValues[key] ?? defaults[key],
        ]),
      ) as SettingsValues,
    [overrides, systemValues],
  );
};

/** A setting's custom property (see style.css), its value for CSS. */
const properties: Record<
  Exclude<Key, 'colorScheme'>,
  [name: string, value: (value: never) => string]
> = {
  contrast: [
    '--uikit-settings-contrast',
    (value: SettingsValues['contrast']) => (value === 'more' ? '1' : '0'),
  ],
  differentiateWithoutColor: [
    '--uikit-settings-differentiate-without-color',
    (value: boolean) => (value ? '1' : '0'),
  ],
  reducedMotion: [
    '--uikit-settings-reduced-motion',
    (value: boolean) => (value ? '1' : '0'),
  ],
  reducedTransparency: [
    '--uikit-settings-reduced-transparency',
    (value: boolean) => (value ? '1' : '0'),
  ],
  textSize: ['--uikit-settings-text-size', (value: string) => value],
};

/**
 * The custom properties (and color scheme) for `overrides`: each key in it
 * (`only`), its value, or reset to the system's (`undefined`).
 */
const styleFor = (overrides: Overrides, only: readonly Key[]) => {
  const style: Record<string, string> = {};
  for (const key of only) {
    const value = overrides[key];
    if (key === 'colorScheme') {
      style['color-scheme'] =
        value === undefined ? 'light dark' : String(value);
      continue;
    }
    const [name, encode] = properties[key];
    style[name] =
      value === undefined ? `var(${name}-system)` : encode(value as never);
  }
  return style;
};

/**
 * The props of a portal opened within providers: their overrides as custom
 * properties (and its color scheme), on the portal (outside their elements,
 * e.g. in the body). Spread by the library's portals (Menu's, Popover's, …).
 */
export const useSettingsPortalProps = (): SettingsPortalProps => {
  const overrides = useContext(SettingsContext);

  return useMemo(() => {
    const overridden = keys.filter((key) => overrides[key] !== undefined);
    if (overridden.length === 0) return {};
    return {
      'data-color-scheme': overrides.colorScheme,
      style: styleFor(overrides, overridden),
    };
  }, [overrides]);
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
 * `display: contents` element (or `render`'s), its overrides on it as
 * custom properties, for CSS, and in context, for `useSettings`. Nested,
 * an inner provider overrides an outer one's, setting by setting.
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

    const element = useRender({
      defaultTagName: 'div',
      props: {
        ...elementProps,
        className: cn('uikit-settings', className),
        'data-color-scheme': own.includes('colorScheme')
          ? props.colorScheme
          : undefined,
        style: withStyle(styleFor(overrides, own), style),
      },
      ref,
      render,
    });

    return (
      <SettingsContext.Provider value={overrides}>
        {element}
      </SettingsContext.Provider>
    );
  },
);

export const Settings = {
  Provider,
};
