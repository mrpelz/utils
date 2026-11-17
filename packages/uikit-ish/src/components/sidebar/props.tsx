import type { ComponentProps } from 'react';

import type { GlassSurfaceProps } from '../glass/main.js';

export type SidebarRootProps = ComponentProps<'nav'> & GlassSurfaceProps;

export type SidebarToolbarProps = ComponentProps<'div'>;

export type SidebarToolbarGroupProps = ComponentProps<'div'>;
