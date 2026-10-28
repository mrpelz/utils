import './styles.css';

import { FunctionComponent, useEffect } from 'react';

import { ColorScheme, colorSchemeAttribute } from './components/utils/main.js';

const noop = () => undefined;

/**
 * Registers an empty, passive `touchstart` listener on the document while
 * mounted: iOS Safari applies `:active` (the components' pressed states) only
 * to elements with such a listener on themselves or an ancestor.
 */
export const useTouchActive = (): void => {
  useEffect(() => {
    document.addEventListener('touchstart', noop, { passive: true });
    return () => document.removeEventListener('touchstart', noop);
  }, []);
};

/**
 * Forces a color scheme on the whole document while mounted (sets
 * `colorSchemeAttribute` on the root element), or follows the browser's
 * preference (`undefined`). (For one element and what's within it, the
 * attribute set on that element.)
 */
export const useColorScheme = (scheme?: ColorScheme): void => {
  useEffect(() => {
    if (!scheme) return undefined;

    const root = document.documentElement;
    root.setAttribute(colorSchemeAttribute, scheme);
    return () => root.removeAttribute(colorSchemeAttribute);
  }, [scheme]);
};

export type StylesProps = {
  /** Forces a color scheme, or follows the browser's preference. */
  colorScheme?: ColorScheme;
};

/**
 * Pressed states on touch and an optionally forced color scheme (the global
 * styles, styles.css, are imported with this module).
 */
export const Styles: FunctionComponent<StylesProps> = ({ colorScheme }) => {
  useTouchActive();
  useColorScheme(colorScheme);

  return null;
};
