import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useSafeJSONStringify } from './use-safe-json-stringify.js';

export const useGetLocalStorage = (key: string): string | undefined =>
  useMemo(() => {
    try {
      return localStorage.getItem(key) ?? undefined;
    } catch {
      return undefined;
    }
  }, [key]);

export const useSetLocalStorage = (key: string, value?: string): void => {
  useEffect(() => {
    try {
      if (value === undefined) {
        localStorage.removeItem(key);
        return;
      }

      localStorage.setItem(key, value);
    } catch {
      // noop
    }
  }, [key, value]);
};

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const persisted_ = useGetLocalStorage(key);
  const persisted = useMemo(() => {
    if (persisted_ === undefined) return undefined;

    try {
      return JSON.parse(persisted_);
    } catch {
      return undefined;
    }
  }, [persisted_]) as T;

  const [value, setValue] = useState<T>(persisted ?? defaultValue);

  const value_ = useSafeJSONStringify(value);
  useSetLocalStorage(key, value === defaultValue ? undefined : value_);

  return [value, setValue];
};
