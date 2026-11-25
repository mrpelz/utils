import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode, RefObject } from 'react';

import type { GlassSurfaceProps } from '../glass/main.js';
import type { GridCornerButtonProps, GridSize } from '../grid/main.js';
import type { SwitchRootProps } from '../switch/props.js';

/** A card's corner button: a `Grid.CornerButton` (see `Card.CornerButton`). */
export type CardCornerButtonProps = Omit<
  GridCornerButtonProps,
  'whileEditing'
> & {
  /**
   * In edit mode: hidden then (`hide`), shown only then (`show`, e.g. a
   * button opening the card's settings), or either way (`stay`). Shown
   * while editing, it's over the card's veil, in the grid's controls'
   * color (see `Grid.CornerButton`).
   * @default 'hide'
   */
  whileEditing?: GridCornerButtonProps['whileEditing'];
};

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

export type CardSymbolProps = ComponentProps<'span'> & {
  /**
   * Whether it shows what it stands for as on, in its tint and its
   * `Symbol`'s `emphasizedIcon` (e.g. filled): for a card that isn't lit
   * while on, for example a dimmer's above its minimum (its fill telling how
   * much). A lit card's symbol shows as on anyway; off, its `icon` (e.g.
   * outlined).
   * @default false
   */
  active?: boolean;
  /**
   * Its color while `active` (a CSS color).
   * @default the switch's on color (`--uikit-switch-on-color`)
   */
  tint?: string;
};

export type CardSwitchProps = Omit<
  SwitchRootProps,
  'children' | 'ref' | 'tint'
> & {
  /**
   * Its color while on (a CSS color): the card's tint, as its symbol's.
   * Over a slider's fill, and in a card never lit (`active` given false,
   * e.g. a dimmer's) at every size, a darker shade of it (it's the fill's
   * color too, see `ControlCards`); off there, a darker shade of the fill's
   * gray.
   * @default the system green; over a slider's fill, the app's tint
   */
  tint?: string;
};

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
    | 'binaryControl'
    | 'binaryDisplay'
    | 'choiceControl'
    | 'numericalControl'
    | 'numericalDisplay'
    | 'progressDisplay'
    | 'stagesDisplay'
    | 'summaryDisplay',
    readonly GridSize[]
  >
>;
