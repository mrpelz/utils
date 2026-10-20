import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/** Changed by a `useLocalStorage` (its key the detail): the others follow. */
const changeEvent = 'demo-local-storage';

const read = <T>(key: string, defaultValue: T): T => {
  // (Server-side, the default.)
  if (typeof localStorage === 'undefined') return defaultValue;
  try {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : (JSON.parse(value) as T);
  } catch {
    return defaultValue;
  }
};

/**
 * A value persisted in local storage under `key`, shared by every use of
 * the key (e.g. demos of a component on different pages, or in other
 * tabs): set in one, they all follow. Unset, it's `defaultValue` (each
 * use's own): mounting stores nothing, and setting the default removes it.
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setState] = useState(() => read(key, defaultValue));

  // (The default as of the first render: a demo's default is constant.)
  const defaultRef = useRef(defaultValue);

  useEffect(() => {
    const update = () => setState(read(key, defaultRef.current));
    update();

    const onChange = (event: Event) => {
      if (event instanceof CustomEvent && event.detail !== key) return;
      if (event instanceof StorageEvent && event.key !== key) return;
      update();
    };
    addEventListener(changeEvent, onChange);
    addEventListener('storage', onChange);

    return () => {
      removeEventListener(changeEvent, onChange);
      removeEventListener('storage', onChange);
    };
  }, [key]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const resolved =
        typeof next === 'function'
          ? (next as (previous: T) => T)(read(key, defaultRef.current))
          : next;
      try {
        // Back at the default: nothing stored (as never set).
        const stored = JSON.stringify(resolved);
        if (stored === JSON.stringify(defaultRef.current)) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, stored);
        }
      } catch {
        // (Unavailable: this use alone keeps it.)
        setState(resolved);
        return;
      }
      dispatchEvent(new CustomEvent(changeEvent, { detail: key }));
    },
    [key],
  );

  return [value, setValue];
};
