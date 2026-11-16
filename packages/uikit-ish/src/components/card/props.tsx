import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode } from 'react';

import type { GridCornerButtonProps, GridSize } from '../grid/main.js';

/** A card's corner button: a `Grid.CornerButton` (see `Card.CornerButton`). */
export type CardCornerButtonProps = GridCornerButtonProps;

export type CardRootProps = useRender.ComponentProps<'div'> & {
  /**
   * Whether it's bright, as a card whose switch is on: e.g. a group of
   * lights, at least one of them on. A switch in it that's on makes it
   * bright too.
   * @default false
   */
  active?: boolean;
};

export type CardSymbolProps = ComponentProps<'span'>;

export type CardTitleProps = ComponentProps<'span'>;

export type CardValueProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** What it shows instead of a number (e.g. a state: “Locked”). */
  children?: ReactNode;
  /**
   * How its `value` is formatted: options for `Intl.NumberFormat` (e.g.
   * `{ maximumFractionDigits: 1, style: 'unit', unit: 'celsius' }`), the
   * app's to choose (its unit, its decimal places).
   */
  format?: Intl.NumberFormatOptions;
  /** The locale its `value` is formatted for (default: the document's). */
  locale?: Intl.LocalesArgument;
  /** A number, formatted (see `format`); else its children. */
  value?: number;
};

/** A card's orientation (see `useCardOrientation`). */
export type CardOrientation = 'horizontal' | 'vertical';

/** The sizes each kind of card supports (see `cardSizes`). */
export type CardSizes = Readonly<
  Record<
    'binaryControl' | 'binaryDisplay' | 'numericalControl' | 'numericalDisplay',
    readonly GridSize[]
  >
>;
