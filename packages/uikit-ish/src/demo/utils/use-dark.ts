import { useEffect, useState } from 'react';

import { ColorScheme } from '../../components/utils/main.js';
import { useLocalStorage } from './use-local-storage.js';

/** Whether the page is dark: forced (demo option), or by preference. */
export const useDark = (): boolean => {
  const [colorScheme] = useLocalStorage<ColorScheme | undefined>(
    'colorScheme',
    undefined,
  );

  // (Server-side, without a preference: light.)
  const [prefersDark, setPrefersDark] = useState(
    () =>
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setPrefersDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return colorScheme === undefined ? prefersDark : colorScheme === 'dark';
};
