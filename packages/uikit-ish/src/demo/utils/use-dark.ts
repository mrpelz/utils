import { useEffect, useState } from 'react';

import { useOptions } from './options-context.js';

/** Whether the page is dark: forced (demo option), or by preference. */
export const useDark = (): boolean => {
  const { colorScheme } = useOptions();
  const [prefersDark, setPrefersDark] = useState(
    () => matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setPrefersDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return colorScheme === undefined ? prefersDark : colorScheme === 'dark';
};
