import { useEffect, useState } from 'react';

/**
 * Whether the page is dark, by preference (a demo's color scheme setting
 * is its stage's alone, see `Settings`).
 */
export const useDark = (): boolean => {
  // (Server-side, without a preference: light.)
  const [isDarkPreferred, setIsDarkPreferred] = useState(
    () =>
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setIsDarkPreferred(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isDarkPreferred;
};
