import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { styled } from 'goober';
import { ComponentProps, CSSProperties, forwardRef } from 'react';

import { fontWeight } from './utils.js';

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

export type AvatarRootProps = Omit<BaseAvatar.Root.Props, 'ref'> & {
  /**
   * Its diameter (px).
   * @default 70
   */
  size?: number;
};

// (Not clipping: its badges overhang; its image and fallback are round.)
const StyledRoot = styled(BaseAvatar.Root, forwardRef)`
  position: relative;
  display: inline-grid;
  width: var(--styled-avatar-size, 70px);
  height: var(--styled-avatar-size, 70px);
  flex: none;
  vertical-align: middle;

  & > img,
  & > [data-avatar-part='fallback'] {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    grid-area: 1 / 1;
  }

  & > img {
    object-fit: cover;
  }
`;

/** A person's avatar (Base UI's `Avatar.Root`). */
const Root = forwardRef<HTMLSpanElement, AvatarRootProps>(
  ({ size, style, ...props }, ref) => (
    <StyledRoot
      ref={ref}
      data-avatar-part="root"
      style={
        size === undefined
          ? style
          : ({
              ...(style as CSSProperties | undefined),
              '--styled-avatar-size': `${String(size)}px`,
            } as CSSProperties)
      }
      {...props}
    />
  ),
);

const StyledFallback = styled(BaseAvatar.Fallback, forwardRef)`
  display: grid;
  background: linear-gradient(#a5abb8, #858994);
  color: #fff;
  font-size: calc(var(--styled-avatar-size, 70px) * 0.4);
  ${fontWeight(590)}
  letter-spacing: 0;
  line-height: 1;
  place-items: center;
  user-select: none;
`;

export type AvatarFallbackProps = Omit<BaseAvatar.Fallback.Props, 'ref'>;

/** Shown without an image: e.g. the person's initials (the app's). */
const Fallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  (props, ref) => (
    <StyledFallback
      ref={ref}
      data-avatar-part="fallback"
      {...props}
    />
  ),
);

// Several people in one circle (on the system fill): the first large, at
// the top start, the second smaller, at the bottom end, a third at the top
// end (counting avatars only: badges are its children too).
const StyledGroup = styled('span', forwardRef)`
  --styled-avatar-group-size: var(--styled-avatar-size, 70px);

  position: relative;
  display: inline-block;
  width: var(--styled-avatar-group-size);
  height: var(--styled-avatar-group-size);
  flex: none;
  border-radius: 50%;
  background-color: var(--color-ios-system-fill);
  vertical-align: middle;

  & > :nth-child(-n + 3 of [data-avatar-part='root']) {
    position: absolute;
  }

  & > :nth-child(1 of [data-avatar-part='root']) {
    --styled-avatar-size: calc(var(--styled-avatar-group-size) * 0.533);

    top: calc(var(--styled-avatar-group-size) * 0.129);
    left: calc(var(--styled-avatar-group-size) * 0.129);
  }

  & > :nth-child(2 of [data-avatar-part='root']) {
    --styled-avatar-size: calc(var(--styled-avatar-group-size) * 0.314);

    right: calc(var(--styled-avatar-group-size) * 0.14);
    bottom: calc(var(--styled-avatar-group-size) * 0.14);
  }

  & > :nth-child(3 of [data-avatar-part='root']) {
    --styled-avatar-size: calc(var(--styled-avatar-group-size) * 0.257);

    top: calc(var(--styled-avatar-group-size) * 0.16);
    right: calc(var(--styled-avatar-group-size) * 0.12);
  }

  & > :nth-child(n + 4 of [data-avatar-part='root']) {
    display: none;
  }
`;

export type AvatarGroupProps = ComponentProps<'span'> & {
  /**
   * Its diameter (px).
   * @default 70
   */
  size?: number;
};

/**
 * Several people in one circle (Figma “Group”): their `Avatar.Root`s (up to
 * three shown); badges (`Badge`) on its corner.
 */
const Group = forwardRef<HTMLSpanElement, AvatarGroupProps>(
  ({ size, style, ...props }, ref) => (
    <StyledGroup
      ref={ref}
      role="group"
      style={
        size === undefined
          ? style
          : ({
              ...(style as CSSProperties | undefined),
              '--styled-avatar-size': `${String(size)}px`,
            } as CSSProperties)
      }
      {...props}
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
