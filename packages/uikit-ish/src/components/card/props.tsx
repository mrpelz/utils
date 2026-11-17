import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode, RefObject } from 'react';

import type { GlassSurfaceProps } from '../glass/main.js';
import type { GridCornerButtonProps, GridSize } from '../grid/main.js';

/** A card's corner button: a `Grid.CornerButton` (see `Card.CornerButton`). */
export type CardCornerButtonProps = GridCornerButtonProps;

/** A card's actions (see `CardRootProps.actionsRef`). */
export type CardActions = {
  /**
   * Lights it up as `active` does, for a moment, and fades it back: for
   * something that happened, for example a doorbell rung, told by the app's
   * server.
   */
  flash: () => void;
};

export type CardRootProps = useRender.ComponentProps<'div'> &
  GlassSurfaceProps & {
    /** Its actions (`flash`), for the app to call from anywhere. */
    actionsRef?: RefObject<CardActions | null>;
    /**
     * Whether what it switches is on (`true`, lit) or off (`false`, dark
     * glass, in both color schemes), so it can be told at a glance: e.g. a
     * group of lights, at least one of them on. Left out, it isn't
     * switchable (e.g. a sensor's): its glass by the color scheme (or its
     * `context`). A switch in it makes it switchable, by its state.
     * @default not switchable (or by its switch)
     */
    active?: boolean;
    /**
     * Whether it's a momentary button: a press flashes it (see `actionsRef`),
     * for a press with no state of its own, for example a chime or “all
     * lights off”. Needs an `onClick`.
     * @default false
     */
    momentary?: boolean;
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
