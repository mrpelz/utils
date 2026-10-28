import './style.css';

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../utils/main.js';

// Base UI's Collapsible, its panel opening and closing in place as a list's
// collapsible rows do (see `List.CollapsiblePanel`): its height and opacity
// transitioning (300ms). Its root and trigger are Base UI's, rendered by
// what they collapse and toggle (e.g. a `List.Section`, its `List.Header`,
// the panel its `List.Group`: a sidebar's sections).
//
// Deviations: none (Base UI's, styled).

/** Base UI's `Collapsible.Panel`, its height and opacity transitioning. */
const Panel = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseCollapsible.Panel>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn('uikit-collapsible-panel', className)}
    data-collapsible-part="panel"
    {...props}
  />
));

export const Collapsible = {
  ...BaseCollapsible,
  Panel,
};
