import type { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';

import type { ToolbarRootProps } from '../toolbar/main.js';

export type HeaderContextValue = {
  /** Whether the header has a large title (see `LargeTitle`). */
  largeTitle: boolean;
  markLargeTitle?: () => () => void;
  /** The large title's view timeline (unique per header). */
  timeline?: string;
};

export type HeaderRootProps = { children?: ReactNode };

export type HeaderBarProps = Omit<ToolbarRootProps, 'placement'>;

export type HeaderLargeTitleProps = useRender.ComponentProps<'div'>;

export type HeaderAccessoryProps = useRender.ComponentProps<'div'>;
