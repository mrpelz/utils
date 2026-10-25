import { sfBell } from '@bradleyhodges/sfsymbols/sfBell';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrayFill } from '@bradleyhodges/sfsymbols/sfTrayFill';

import { Badge } from '../../../components/index.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsSymbol = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  icon: [
    new MappedProp(sfBell, '[bell]'),
    new MappedProp(sfHeartFill, '[heart.fill]'),
    new MappedProp(sfMagnifyingglass, '[magnifyingglass]'),
    new MappedProp(sfSquareAndArrowUp, '[square.and.arrow.up]'),
    new MappedProp(sfTrayFill, '[tray.fill]'),
  ] as const,
  // On the symbol: a badge (a count, or a dot).
  children: [
    undefined,
    new MappedProp(<Badge placement="symbol">3</Badge>, '[badge: 3]'),
    new MappedProp(<Badge placement="symbol" />, '[badge: dot]'),
  ] as const,
};

export const propOptionsContent = {
  // Sized and colored as the text around it.
  fontSize: ['17px', '28px', '48px', '11px'] as const,
  color: [
    undefined,
    'var(--color-ios-primary)',
    'var(--color-ios-secondary-label)',
  ] as const,
};

// The guide pages' views (see overview.tsx).

/** The overview's: the symbol, and the text style it's in. */
export const propOptionsOverviewSymbol = {
  icon: propOptionsSymbol.icon,
};

export const propOptionsOverviewText = {
  textStyle: [undefined, 'largeTitle', 'title3', 'footnote'] as const,
  emphasized: [undefined, false, true] as const,
  color: [undefined, 'secondary'] as const,
};
