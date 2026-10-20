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

type TOptionsContext = {
  /**
   * Opened in a tab of its own from a guide page (its Fullscreen link, see
   * Component), for closing it again.
   */
  back?: boolean;
  id?: string;
  raw: boolean;
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

/**
 * A demo's URL with its state: on the current page, or on `path`'s (e.g.
 * `viewport/all`, relative to the document's base), then with `back`.
 */
export const useCreateStateUrl = (
  id: string,
  states?: unknown[],
  path?: string,
  back?: boolean,
): string | undefined =>
  useMemo(() => {
    if (path !== undefined) {
      return `${path}#${createFragment({ back, id, state: states }, '') ?? ''}`;
    }

    // (Server-side, none: preact-iso's prerendering stubs `location` as
    // `http://localhost/…`.)
    if (typeof window === 'undefined') return undefined;
    const url = new URL(location.href);

    const fragment = createFragment({ id, state: states });
    if (!fragment) return undefined;

    url.hash = fragment;

    return url.href;
  }, [back, id, path, states]);
