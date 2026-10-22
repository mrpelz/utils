import '../typography/style.css';
import './style.css';

import { ComponentProps, forwardRef } from 'react';

import { cn } from '../utils/main.js';
import type {
  ActivityViewActionProps,
  ActivityViewPersonProps,
} from './props.js';

export type {
  ActivityViewActionProps,
  ActivityViewPersonProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Activity Views”, UIKit
// `UIActivityViewController`, a share sheet), in the app's sheet (iPhone)
// or popover (iPad), as parts:
// - a header (16px in, its parts 16px apart): a thumbnail (64px, its
//   corners 16px, a 0.5px border), its title (15px, medium) and subtitle
//   (13px, the secondary label color) 1px apart, then (12px below) e.g. a
//   menu (a `Button`) and a message (13px, the secondary label color);
// - rows scrolling sideways, 24px from their start, their items 14px apart:
//   people (an `Avatar` above their name, 12px, two lines; a group's count
//   below) and actions (a 70px circle on a fill, its symbol 25px, above its
//   label, 13px, two lines), 78px wide;
// - separators between them (0.5px, 16px in);
// - its actions as a list (a `List`).
//
// Deviations:
// - A group's name (with a count) takes one line, truncated (iOS: scaled
//   down to fit it).
// - The actions' symbols are light (user: thinner; Figma: regular).
// - Apps (Figma's app icon row, its people's app badges) aren't built: an
//   avatar takes a `Badge` instead.

/** Its header: a thumbnail, and its heading (title, subtitle, more). */
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-activity-view-part="header"
      {...props}
      className={cn('uikit-activity-view-header', className)}
    />
  ),
);

/** What's shared (64px, its corners 16px): an image, or content. */
const Thumbnail = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-activity-view-thumbnail', className)}
      data-activity-view-part="thumbnail"
      {...props}
    />
  ),
);

/** Its title, subtitle, and what follows them (e.g. a menu, a message). */
const Heading = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-activity-view-heading', className)}
      data-activity-view-part="heading"
      {...props}
    />
  ),
);

const Title = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-activity-view-title', className)}
      data-activity-view-part="title"
      {...props}
    />
  ),
);

const Subtitle = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-activity-view-part="subtitle"
      {...props}
      className={cn('uikit-activity-view-subtitle', className)}
    />
  ),
);

/** A message (e.g. who can edit), in the secondary label color. */
const Message = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-activity-view-message', className)}
      data-activity-view-part="message"
      {...props}
    />
  ),
);

/** Its people (`Person`s), scrolling sideways. */
const People = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    // A row scrolling sideways (people, actions).
    <div
      ref={ref}
      data-activity-view-part="people"
      role="list"
      {...props}
      className={cn('uikit-activity-view-row', className)}
    />
  ),
);

/** Its actions (`Action`s), scrolling sideways. */
const Actions = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-activity-view-part="actions"
      role="list"
      {...props}
      className={cn('uikit-activity-view-row', className)}
    />
  ),
);

/** A person (or a group) to share with: its `Avatar` (the children). */
const Person = forwardRef<HTMLButtonElement, ActivityViewPersonProps>(
  ({ className, ...props }, ref) => (
    // A person or an action (see style.css), in its list item.
    <div
      className="uikit-activity-view-list-item"
      data-activity-view-part="list-item"
      role="listitem"
    >
      <button
        ref={ref}
        type="button"
        {...props}
        className={cn('uikit-activity-view-item', className)}
        data-activity-view-part="item"
      />
    </div>
  ),
);

/** A person's name (e.g. first and last name, two lines). */
const Name = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-activity-view-name', className)}
      data-activity-view-part="name"
    />
  ),
);

/**
 * How many people (a group's, e.g. “2 People”), below its name (on one
 * line then).
 */
const Count = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-activity-view-count', className)}
      data-activity-view-part="count"
    />
  ),
);

/** An action (Figma “Action”): its `Symbol` above its `Label`. */
const Action = forwardRef<HTMLButtonElement, ActivityViewActionProps>(
  ({ className, ...props }, ref) => (
    <div
      className="uikit-activity-view-list-item"
      data-activity-view-part="list-item"
      role="listitem"
    >
      <button
        ref={ref}
        type="button"
        {...props}
        data-activity-view-part="item"
        className={cn(
          'uikit-activity-view-item uikit-activity-view-action',
          className,
        )}
      />
    </div>
  ),
);

/** An action's symbol (e.g. a `Symbol`) in a 70px circle on a fill. */
const ActionSymbol = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      {...props}
      className={cn('uikit-activity-view-symbol', className)}
      data-activity-view-part="symbol"
    />
  ),
);

/** An action's label (e.g. “Add to Reading List”, two lines). */
const Label = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-activity-view-label', className)}
      data-activity-view-part="label"
    />
  ),
);

/** Between its sections (0.5px, 16px in). */
const Separator = forwardRef<HTMLHRElement, ComponentProps<'hr'>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('uikit-activity-view-separator', className)}
      data-activity-view-part="separator"
      {...props}
    />
  ),
);

/**
 * An activity view (UIKit `UIActivityViewController`, a share sheet): what's
 * shared (`Header`), people and actions (`People`, `Actions`), and more
 * actions (a `List`), in the app's sheet or popover.
 */
export const ActivityView = {
  Header,
  Thumbnail,
  Heading,
  Title,
  Subtitle,
  Message,
  People,
  Person,
  Name,
  Count,
  Actions,
  Action,
  Symbol: ActionSymbol,
  Label,
  Separator,
};
