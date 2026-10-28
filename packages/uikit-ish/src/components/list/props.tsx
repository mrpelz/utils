import type { useRender } from '@base-ui/react/use-render';
import type { Properties } from 'csstype';
import type { JSX, MouseEvent, ReactNode } from 'react';

import type { SecondaryClickProps } from '../utils/main.js';
import type { ListSwipeActionsHandle } from './swipe-actions-handle.js';

export type ListStyle = 'grouped' | 'insetGrouped' | 'plain' | 'sidebar';

export type Side = 'leading' | 'trailing';

export type IntrinsicTag = keyof JSX.IntrinsicElements;

/** Props of a part rendering `Tag`, replaceable via `render` (Base UI). */
// Button-like parts (buttons, rows) take a secondary click (see
// `useSecondaryClick`).
export type PartProps<Tag extends IntrinsicTag> = Omit<
  useRender.ComponentProps<Tag>,
  'ref'
> &
  (Tag extends 'button' | 'li' ? SecondaryClickProps : unknown);

/**
 * An edit mode (UIKit `isEditing`), by side: `leading` (its rows' leading
 * edit controls, `Checkbox`, `Radio`, `EditButton`, slid in), `trailing`
 * (their trailing ones, `Grabber`), `both`, `none` (not editing: all slid
 * out, hidden), or `ignore` (not managed: shown as they are). Parts react
 * by their `whileEditing`.
 */
export type ListEditing = 'both' | 'ignore' | 'leading' | 'none' | 'trailing';

/**
 * A row part in edit mode (its side's, see `ListEditing`): `show` (only
 * while its side edits, sliding in: edit controls' and grabbers' default),
 * `hide` (sliding out while its side edits, e.g. a `Detail` making way for a
 * grabber: `DrillIn`'s default), or `stay`. Other elements in a row take
 * `data-while-editing`.
 */
export type ListWhileEditing = 'hide' | 'show' | 'stay';

/** A row part's edit mode behavior (see `ListWhileEditing`). */
export type WhileEditingProps = {
  /** In edit mode (its side's): shown only then, hidden then, or as is. */
  whileEditing?: ListWhileEditing;
};

export type ListRootProps = PartProps<'div'> & {
  /**
   * Its sections' edit mode, unless their own (see `ListEditing`; Section,
   * Group, Item: each overriding the one around it).
   * @default 'ignore'
   */
  editing?: ListEditing;
  /**
   * UIKit `UITableView.Style`.
   * @default 'insetGrouped'
   */
  listStyle?: ListStyle;
  /**
   * Outlines its groups (Framework7 `.list-outline`): hairlines above and
   * below, or a border around inset ones.
   */
  outline?: boolean;
};

export type ListGroupProps = PartProps<'ul'> & {
  /** Its rows' edit mode, unless their own (see `ListEditing`). */
  editing?: ListEditing;
  /**
   * Called when a row is moved by its `Grabber` from one index to another
   * (among the group's rows); the app reorders them.
   */
  onReorder?: (from: number, to: number) => void;
};

export type ListSectionProps = PartProps<'section'> & {
  /** Its groups' edit mode, unless their own (see `ListEditing`). */
  editing?: ListEditing;
};

export type ListItemProps = PartProps<'li'> & {
  /**
   * As `Button`: the cursor.
   * @default 'pointer' with a click handler
   */
  cursor?: Properties['cursor'];
  /**
   * Its edit mode, overriding its group's (see `ListEditing`), e.g.
   * `none` or `ignore` exempting it.
   */
  editing?: ListEditing;
  /** Its level in a hierarchy (indented 20px per level; e.g. a sidebar). */
  level?: number;
  /** Selected (e.g. a sidebar's current section): on a fill. */
  selected?: boolean;
};

export type ItemContextValue = {
  /** The item's swipe actions, by side. */
  close: () => void;
  isOpen: (side: Side) => boolean;
  open: (side: Side) => void;
  /**
   * Sets (or, with `undefined`, removes) the actions of a side, and what
   * swiping past them does (see `Overswipe`).
   */
  setActions: (
    side: Side,
    element: HTMLElement | undefined,
    overswipe?: Overswipe,
    allowSwipe?: ListAllowSwipe,
  ) => void;
};

/**
 * What swiping does to a side's actions: opens and closes them (`all`),
 * only opens (`reveal`) or only closes them (`conceal`), or neither
 * (`none`: only their trigger or handle does).
 */
export type ListAllowSwipe = 'all' | 'conceal' | 'none' | 'reveal';

/**
 * What swiping past a side's actions does: nothing (`false`), triggering
 * the outermost action (`true`), or calling a handler.
 */
export type Overswipe = boolean | (() => void);

export type Handler<E> = ((event: E) => void) | undefined;

/** A swipeable row's geometry (see `Item`), by side. */
export type Swipe = {
  /** How far the row moves to arm overswiping. */
  arms: Partial<Record<Side, number>>;
  /** How far the row moves at most (overswiping: across the whole row). */
  extents: Partial<Record<Side, number>>;
  /** The actions' widths. */
  widths: Partial<Record<Side, number>>;
};

/** A mouse drag swiping a row (see `Item`). */
export type Drag = {
  /** The row's offset when it started. */
  base: number;
  isMoved: boolean;
  pointerId: number;
  scroll: number;
  time: number;
  x: number;
  y: number;
};

export type ListExpandableProps = ListItemProps & {
  /**
   * Shown; changing, its height and padding transition.
   * @default its `ExpandableRoot`'s state, or `false`
   */
  open?: boolean;
};

export type ListExpandableRootProps = {
  children?: ReactNode;
  /**
   * Initially open (uncontrolled; toggled by its `ExpandableTrigger`).
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when its trigger opens or closes it. */
  onOpenChange?: (open: boolean, event: MouseEvent<HTMLElement>) => void;
  /** Open (controlled, with `onOpenChange`). */
  open?: boolean;
};

export type ExpandableContextValue = {
  /** The expandable row's id (its trigger's `aria-controls`). */
  id: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean, event: MouseEvent<HTMLElement>) => void;
};

export type ListTextProps = PartProps<'span'> & {
  /**
   * Lines shown at most, ellipsized.
   * @default 2 (Framework7 `.item-text`)
   */
  lines?: number;
};

export type ListImageProps = PartProps<'span'> &
  WhileEditingProps & {
    /**
     * Figma “_Images” Type.
     * @default 'symbol'
     */
    variant?: 'circular' | 'fill' | 'rounded' | 'symbol';
  };

export type ListButtonProps = PartProps<'button'> & {
  /** Figma Value=Destructive. */
  destructive?: boolean;
};

export type ListEditButtonProps = PartProps<'button'> &
  WhileEditingProps & {
    /**
     * Its symbol's color, e.g. for a light `tint`.
     * @default white
     */
    textColor?: string;
    /**
     * Its circle's color (e.g. `systemRed` deleting, `systemGreen` inserting:
     * UIKit's editing styles).
     * @default `systemGray`
     */
    tint?: string;
  };

export type ListSwipeActionsProps = PartProps<'div'> & {
  /**
   * What swiping does to them (see `ListAllowSwipe`): with `reveal` or
   * `none`, open, a press outside the row doesn't close them either.
   * @default 'all'
   */
  allowSwipe?: ListAllowSwipe;
  /**
   * Their handle (see `List.createSwipeActionsHandle`): opened and closed by
   * it, from anywhere (e.g. a `List.SwipeActionsTrigger` outside the row).
   */
  handle?: ListSwipeActionsHandle;
  /**
   * Called when released swiped on past the actions (overswiped), instead of
   * triggering the outermost action; enables `overswipe`.
   */
  onOverswipe?: () => void;
  /**
   * Swiping on past the actions stretches the outermost one up to the
   * others (following the row), and, past 304px, triggers it on
   * release (Framework7 `.swipeout-overswipe`; UIKit
   * `performsFirstActionWithFullSwipe`).
   */
  overswipe?: boolean;
  /**
   * The row's side the actions are revealed on.
   * @default 'inline-end'
   */
  side?: 'inline-end' | 'inline-start';
};

export type ListSwipeActionsTriggerProps = PartProps<'button'> & {
  /**
   * The actions it opens, by their handle (see
   * `List.createSwipeActionsHandle`): from anywhere. Unset: its row's, on
   * its `side` (it's in the row).
   */
  handle?: ListSwipeActionsHandle;
  /**
   * In its row, without a `handle`: the side whose actions it opens.
   * @default 'inline-end'
   */
  side?: 'inline-end' | 'inline-start';
};

export type ListSwipeActionProps = PartProps<'button'> & {
  /** The action's name: its accessible name (see `showLabel`). */
  label: string;
  /**
   * The action's shape: a 44px circle, or a capsule around wider content
   * (default); or a rounded rectangle (12px corners, as large buttons') as
   * high as the row (4px from its edges), at least 60px wide.
   */
  shape?: 'circle' | 'roundedRectangle';
  /**
   * Shows the label below the shape (Figma “Label”). It needs room: for
   * multi-line rows (`Text`).
   * @default false
   */
  showLabel?: boolean;
  /**
   * Text color, e.g. for a light `tint`.
   * @default white
   */
  textColor?: string;
  /**
   * Background color.
   * @default `systemGray`
   */
  tint?: string;
};

export type ListHeaderProps = PartProps<'div'> & {
  /**
   * As `Button`, when it's a button (e.g. a Base UI `Collapsible.Trigger`): the
   * cursor.
   * @default 'pointer'
   */
  cursor?: Properties['cursor'];
  /**
   * Figma “Header” Type; `nested` headers of plain lists are section titles
   * (Figma “Section Title”).
   * @default 'prominent'
   */
  prominence?: 'extraProminent' | 'nested' | 'prominent';
};

export type ListBlockProps = PartProps<'div'> & {
  /** On the rows' background (Framework7 `.block-strong`). */
  strong?: boolean;
};

export type ListIndexProps = PartProps<'nav'> & {
  /** UIKit size class: `compact` (iPhone, default) or `regular` (iPad). */
  size?: 'compact' | 'regular';
};

export type Scrub = { item?: HTMLElement };
