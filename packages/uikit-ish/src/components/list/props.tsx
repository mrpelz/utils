import type { useRender } from '@base-ui/react/use-render';
import type { Properties } from 'csstype';
import type { JSX, ReactNode } from 'react';

import type { SecondaryClickProps } from '../utils/main.js';
import type { ListReorderHandle } from './reorder.js';
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
 * A row slot (`Leading`, `Trailing`) in edit mode (its side's, see
 * `ListEditing`): `show` (only while its side edits, sliding in: e.g. edit
 * controls', a grabber's), `hide` (sliding out while its side edits: e.g. a
 * chevron's, making way for a grabber), or `stay` (the default, whatever it
 * holds: placing is the slots', not their parts').
 */
export type ListWhileEditing = 'hide' | 'show' | 'stay';

/** A row slot's edit mode behavior (see `ListWhileEditing`). */
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
  /** Its name, the target's, for its gaps (see `reorderHandle`). */
  dropName?: string;
  /** Its rows' edit mode, unless their own (see `ListEditing`). */
  editing?: ListEditing;
  /**
   * Handles whose rows can be dropped before, between and after its rows (as
   * a `DropGroup` around them; see `List.createReorderHandle`).
   */
  reorderHandle?: ListReorderHandle | readonly ListReorderHandle[];
};

export type ListDropGroupProps = {
  children?: ReactNode;
  /** Its name, the target's, for its gaps. */
  dropName?: string;
  /** Handles whose rows can be dropped before, between and after its rows. */
  reorderHandle: ListReorderHandle | readonly ListReorderHandle[];
};

export type ListDropTargetProps = PartProps<'li'> & {
  /** Its name, the target's. */
  dropName?: string;
  /** Handles whose rows can be dropped where it's placed. */
  reorderHandle: ListReorderHandle | readonly ListReorderHandle[];
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
  /**
   * Its name in reordering: the moved rows' (`ListReorderItem`), and a gap's
   * neighbours' (`ListReorderTarget` `after`, `before`).
   */
  dropName?: string;
  editing?: ListEditing;
  /** Its level in a hierarchy (indented 20px per level; e.g. a sidebar). */
  level?: number;
  /**
   * Handles it's reordered by (see `List.createReorderHandle`), by priority:
   * dropped where several of them are targets, the first of those (grabbed
   * with other rows, of the handles all of them have, by the first row's
   * order).
   */
  reorderHandle?: ListReorderHandle | readonly ListReorderHandle[];
  /** Selected (e.g. a sidebar's current section): on a fill. */
  selected?: boolean;
};

export type ItemContextValue = {
  /** The item's swipe actions, by side. */
  close: () => void;
  /** Focuses the first of a side's actions, open (see `SwipeActionsTrigger`). */
  focus: (side: Side) => void;
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
 * What the user does to a side's actions, swiping (or by keyboard): opens
 * and closes them (`all`), only opens (`reveal`) or only closes them
 * (`conceal`), or neither (`none`: only their trigger or handle does).
 * Not revealed, closed, they're inert (not focused); not concealed, open,
 * neither focus leaving the row nor a press outside it closes them.
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

/** Why rows opened or closed (Base UI's), and the event. */
export type ListCollapsibleChangeEventDetails = {
  event: Event;
  reason: 'none' | 'trigger-press';
};

export type ListCollapsibleRootProps = {
  children?: ReactNode;
  /**
   * Initially open (uncontrolled; toggled by its `CollapsibleTrigger`).
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Its trigger ignores presses.
   * @default false
   */
  disabled?: boolean;
  /** Called when its trigger opens or closes it, and why. */
  onOpenChange?: (
    open: boolean,
    eventDetails: ListCollapsibleChangeEventDetails,
  ) => void;
  /** Open (controlled, with `onOpenChange`). */
  open?: boolean;
};

export type ListCollapsiblePanelProps = {
  /** Its rows (`Item`s), among the group's. */
  children?: ReactNode;
};

export type ListAccordionRootProps<Value = unknown> = {
  children?: ReactNode;
  /**
   * Its items open initially (uncontrolled), by their `value`.
   * @default []
   */
  defaultValue?: readonly Value[];
  /**
   * Its items' triggers ignore presses.
   * @default false
   */
  disabled?: boolean;
  /**
   * Several items open at once; otherwise, opening one closes the others.
   * @default false
   */
  multiple?: boolean;
  /** Called when an item opens or closes, with the items open, and why. */
  onValueChange?: (
    value: Value[],
    eventDetails: ListCollapsibleChangeEventDetails,
  ) => void;
  /** Its items open (controlled, with `onValueChange`), by their `value`. */
  value?: readonly Value[];
};

export type ListAccordionItemProps<Value = unknown> = {
  children?: ReactNode;
  /**
   * Its trigger ignores presses.
   * @default its `AccordionRoot`'s `disabled`
   */
  disabled?: boolean;
  /** Called when it opens or closes, and why. */
  onOpenChange?: (
    open: boolean,
    eventDetails: ListCollapsibleChangeEventDetails,
  ) => void;
  /**
   * Its value, among its root's.
   * @default its own
   */
  value?: Value;
};

/** A collapsible's (a `CollapsibleRoot`'s, an `AccordionItem`'s) state. */
export type CollapsibleContextValue = {
  /** Its rows' ids (its trigger's `aria-controls`, see `useExpandedRow`). */
  controls: string | undefined;
  disabled: boolean;
  isOpen: boolean;
  /** Registers a row's id; returns what unregisters it. */
  register: (id: string) => () => void;
  setOpen: (
    isOpen: boolean,
    eventDetails: ListCollapsibleChangeEventDetails,
  ) => void;
};

/** An `AccordionRoot`'s, for its items. */
export type AccordionContextValue = {
  disabled: boolean;
  isOpen: (value: unknown) => boolean;
  setOpen: (
    value: unknown,
    isOpen: boolean,
    eventDetails: ListCollapsibleChangeEventDetails,
  ) => void;
};

/** A `CollapsiblePanel`'s, for its rows. */
export type PanelContextValue = {
  isOpen: boolean;
  register: ((id: string) => () => void) | undefined;
};

export type ListTextProps = PartProps<'span'> & {
  /**
   * Lines shown at most, ellipsized.
   * @default 2 (Framework7 `.item-text`)
   */
  lines?: number;
};

export type ListImageProps = PartProps<'span'> & {
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

export type ListEditButtonProps = PartProps<'button'> & {
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
   * What the user does to them, swiping or by keyboard (see
   * `ListAllowSwipe`).
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
