import type { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';

export type HeaderContextValue = {
  /** Whether the header has a large title (see `LargeTitle`). */
  hasLargeTitle: boolean;
  markLargeTitle?: () => () => void;
  /** The large title's view timeline (unique per header). */
  timeline?: string;
};

export type HeaderRootProps = { children?: ReactNode };

export type HeaderLargeTitleProps = useRender.ComponentProps<'div'>;

export type HeaderAccessoryProps = useRender.ComponentProps<'div'>;
