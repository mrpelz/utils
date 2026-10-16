import { useMemo } from 'react';

export const useSafeJSONStringify = <T>(input: T): string | undefined =>
  useMemo(() => {
    try {
      return JSON.stringify(input);
    } catch {
      return undefined;
    }
  }, [input]);
