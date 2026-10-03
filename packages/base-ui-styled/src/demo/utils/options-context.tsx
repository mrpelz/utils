/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react-dom';

import { ColorScheme } from '../../components/utils.js';

type TOptionsContext = {
  colorScheme?: ColorScheme;
  id: string[];
  raw: boolean;
  stageBackground: boolean;
};

const optionsDefaults: TOptionsContext = {
  id: [],
  raw: false,
  stageBackground: true,
};

export const setOptions = (options: Partial<TOptionsContext>): void => {
  const fragment = new URLSearchParams(location.hash.slice(1));

  for (const [key, values] of Object.entries(options)) {
    fragment.delete(key);

    if (values === undefined) continue;

    for (const value of Array.isArray(values) ? values : [values]) {
      fragment.append(key, JSON.stringify(value));
    }
  }

  location.hash = fragment.size > 0 ? fragment.toString() : '?';
};

export const OptionsContext = createContext(
  undefined as unknown as TOptionsContext,
);

export const OptionsProvider: FunctionComponent = ({ children }) => {
  const getFragementOptions = useCallback(() => {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const result = {} as any;

    for (const key of fragment.keys()) {
      const values = fragment.getAll(key);
      if (values.length === 0) continue;

      const parsed = values
        .map((value) => {
          try {
            return JSON.parse(value);
          } catch {
            return undefined;
          }
        })
        .filter((value) => value !== undefined);

      result[key] = parsed.length === 1 ? parsed.at(0) : parsed;
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
