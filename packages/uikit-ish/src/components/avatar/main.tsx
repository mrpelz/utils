import './style.css';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { forwardRef } from 'react';

import { cn, withStyle } from '../utils/main.js';
import type {
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarRootProps,
} from './props.js';

export type {
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarRootProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Activity Views”: “Contact”): a person's
// photo in a circle (70px); several people (“Group”) in one circle on the
// system fill: the first 37px (of 70px) from 9px in, the second 22px, at
// the opposite corner. Base UI's `Avatar`: its image once loaded, otherwise
// its fallback.
//
// Deviations:
// - The fallback (e.g. the person's initials, the app's) on iOS contacts'
//   gray gradient (Figma: photos only), its text 40% of the avatar,
//   semibold, white.
// - A third person in a group: 26% of it, at the top end.
// - Badges (`Badge`, a child) sit on its top end corner (Figma: an app's
//   icon at its bottom end, which isn't built).

/** A person's avatar (Base UI's `Avatar.Root`). */
const Root = forwardRef<HTMLSpanElement, AvatarRootProps>(
  ({ className, size, style, ...props }, ref) => (
    // (Not clipping: its badges overhang; its image and fallback are round.)
    <BaseAvatar.Root
      ref={ref}
      data-avatar-part="root"
      style={withStyle(
        {
          '--uikit-avatar-size':
            size === undefined ? undefined : `${String(size)}px`,
        },
        style,
      )}
      {...props}
      className={cn('uikit-avatar-root', className)}
    />
  ),
);

/** Shown without an image: e.g. the person's initials (the app's). */
const Fallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <BaseAvatar.Fallback
      ref={ref}
      data-avatar-part="fallback"
      {...props}
      className={cn('uikit-avatar-fallback', className)}
    />
  ),
);

/**
 * Several people in one circle (Figma “Group”): their `Avatar.Root`s (up to
 * three shown); badges (`Badge`) on its corner.
 */
const Group = forwardRef<HTMLSpanElement, AvatarGroupProps>(
  ({ className, size, style, ...props }, ref) => (
    // Several people in one circle (on the system fill): the first large, at
    // the top start, the second smaller, at the bottom end, a third at the top
    // end (counting avatars only: badges are its children too).
    <span
      ref={ref}
      role="group"
      style={withStyle(
        {
          '--uikit-avatar-size':
            size === undefined ? undefined : `${String(size)}px`,
        },
        style,
      )}
      {...props}
      className={cn('uikit-avatar-group', className)}
      data-avatar-part="group"
    />
  ),
);

/**
 * An avatar (Base UI's `Avatar`): a person's photo, or their initials; or
 * several people (`Avatar.Group`).
 */
export const Avatar = {
  ...BaseAvatar,
  Root,
  Fallback,
  Group,
};
