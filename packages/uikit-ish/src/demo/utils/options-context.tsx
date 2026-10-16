/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ColorScheme } from '../../components/utils/main.js';

type TOptionsContext = {
  colorScheme?: ColorScheme;
  id?: string;
  raw: boolean;
  stageBackground: boolean;
  state?: unknown[];
};

const optionsDefaults: TOptionsContext = {
  raw: false,
  stageBackground: true,
};

const createFragment = (options: Partial<TOptionsContext>) => {
  const fragment = new URLSearchParams(location.hash.slice(1));

  for (const [key, value] of Object.entries(options)) {
    fragment.delete(key);

    if (value === undefined) continue;

    fragment.set(key, JSON.stringify(value));
  }

  return fragment.size > 0 ? fragment.toString() : undefined;
};

export const setOptions = (options: Partial<TOptionsContext>): void => {
  const fragment = createFragment(options);
  location.hash = fragment ?? '?';
};

const OptionsContext = createContext(undefined as unknown as TOptionsContext);

export const OptionsProvider: FunctionComponent = ({ children }) => {
  const getFragementOptions = useCallback(() => {
    const fragment = new URLSearchParams(location.hash.slice(1));
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
  }, []);

  const [params, setParams] = useState(getFragementOptions);

  useEffect(() => {
    const abort = new AbortController();

    addEventListener(
      'hashchange',
      () => {
        setParams(getFragementOptions());
      },
      { signal: abort.signal },
    );

    return () => abort.abort();
  }, [getFragementOptions]);

  return (
    <OptionsContext.Provider value={params}>{children}</OptionsContext.Provider>
  );
};

export const useOptions = (): TOptionsContext => useContext(OptionsContext);

export const useProvidedState = (demoId: string): unknown[] => {
  const { id, state } = useOptions();

  return useMemo(() => {
    if (id === demoId && state) {
      return state;
    }

    return [];
  }, [demoId, id, state]);
};

export const useCreateStateUrl = (
  id: string,
  states: unknown[],
): string | undefined =>
  useMemo(() => {
    const url = new URL(location.href);

    const fragment = createFragment({ id, state: states });
    if (!fragment) return undefined;

    url.hash = fragment;

    return url.href;
  }, [id, states]);
