import type { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';

export type AvatarRootProps = Omit<BaseAvatar.Root.Props, 'ref'> & {
  /**
   * Its diameter (px).
   * @default 70
   */
  size?: number;
};

export type AvatarFallbackProps = Omit<BaseAvatar.Fallback.Props, 'ref'>;

export type AvatarGroupProps = ComponentProps<'span'> & {
  /**
   * Its diameter (px).
   * @default 70
   */
  size?: number;
};
