/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from 'preact-iso';
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ColorScheme } from '../../components/utils/main.js';

/**
 * A demo's frame settings (see `Component`): its defaults the demo's own,
 * changed in its config column, carried by its URL (see
 * `useCreateStateUrl`); not kept otherwise.
 */
export type Settings = {
  backdrop: boolean;
  center: boolean;
  /** Forced on its stage (see `colorSchemeAttribute`). */
  colorScheme?: ColorScheme;
  /** Inline: as wide as the viewport (not the page's column). */
  expanded: boolean;
  /** Its devices' safe area insets, hatched (see shared/style.css). */
  safeAreas: boolean;
  stageBackground: boolean;
  stretch: boolean;
};

type TOptionsContext = {
  /**
   * Opened in a tab of its own from a guide page (its Fullscreen link, see
   * Component), for closing it again.
   */
  back?: boolean;
  id?: string;
  raw: boolean;
  /** Its settings changed from its defaults (see `Settings`). */
  settings?: Partial<Settings>;
  state?: unknown[];
};

const optionsDefaults: TOptionsContext = {
  raw: false,
};

// (Without a `hash`, the current location's options are kept.)
const createFragment = (
  options: Partial<TOptionsContext>,
  hash = location.hash,
) => {
  const fragment = new URLSearchParams(hash.slice(1));

  for (const [key, value] of Object.entries(options)) {
    fragment.delete(key);

    if (value === undefined) continue;

    fragment.set(key, JSON.stringify(value));
  }

  return fragment.size > 0 ? fragment.toString() : undefined;
};

const OptionsContext = createContext(undefined as unknown as TOptionsContext);

const readOptions = (hash: string) => {
  const fragment = new URLSearchParams(hash.slice(1));
  const result = {} as any;

  for (const key of fragment.keys()) {
    const value = fragment.get(key);
    if (value === null) continue;

    const parsed = (() => {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    })();

    result[key] = parsed;
  }

  return { ...optionsDefaults, ...result } as TOptionsContext;
};

export const OptionsProvider: FunctionComponent = ({ children }) => {
  // Rendered again as the router navigates (a link's fragment, pushed
  // without a `hashchange`), and as the fragment changes otherwise.
  useLocation();
  const [, setHashChanges] = useState(0);

  useEffect(() => {
    const abort = new AbortController();
    const onChange = () => setHashChanges((count) => count + 1);

    addEventListener('hashchange', onChange, { signal: abort.signal });
    addEventListener('popstate', onChange, { signal: abort.signal });

    return () => abort.abort();
  }, []);

  const { hash } = location;
  const params = useMemo(() => readOptions(hash), [hash]);

  return (
    <OptionsContext.Provider value={params}>{children}</OptionsContext.Provider>
  );
};

export const useOptions = (): TOptionsContext => useContext(OptionsContext);

export const useProvidedState = (demoId: string): unknown[] => {
  const { id, state } = useOptions();

  return useMemo(
    () => (id === demoId && state ? state : []),
    [demoId, id, state],
  );
};

/** A demo's settings from the URL (those changed from its defaults). */
export const useProvidedSettings = (
  demoId: string,
): Partial<Settings> | undefined => {
  const { id, settings } = useOptions();

  return id === demoId ? settings : undefined;
};

/**
 * A demo's URL with its state (its prop controls') and its settings
 * changed: on the current page, or on `path`'s (e.g. `viewport/all`,
 * relative to the document's base), then with `back`.
 */
export const useCreateStateUrl = (
  id: string,
  {
    back,
    path,
    settings,
    state,
  }: {
    back?: boolean;
    path?: string;
    settings?: Partial<Settings>;
    state?: unknown[];
  },
): string | undefined =>
  useMemo(() => {
    if (path !== undefined) {
      return `${path}#${createFragment({ back, id, settings, state }, '') ?? ''}`;
    }

    // (Server-side, none: preact-iso's prerendering stubs `location` as
    // `http://localhost/…`.)
    if (typeof window === 'undefined') return undefined;
    const url = new URL(location.href);

    const fragment = createFragment({ id, settings, state });
    if (!fragment) return undefined;

    url.hash = fragment;

    return url.href;
  }, [back, id, path, settings, state]);
