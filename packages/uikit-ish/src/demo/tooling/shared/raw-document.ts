import { useLayoutEffect } from 'react';

/**
 * Raw, the page is the app (its screen the window's): the document marked,
 * so it doesn't bounce (see style.css); titled as the app. (Added to the
 * Home Screen as itself, see scripts/demo-head.js: decided as the page
 * loads.) E.g. a raw demo (see frame/component.tsx), the kitchen sink.
 */
export const useRawDocument = (isShown: boolean, title: string): void => {
  useLayoutEffect(() => {
    if (!isShown) return undefined;
    const { documentElement: root } = document;
    root.dataset.demoRaw = '';
    const { title: documentTitle } = document;
    document.title = title;

    return () => {
      delete root.dataset.demoRaw;
      document.title = documentTitle;
    };
  }, [isShown, title]);
};
