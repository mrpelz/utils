import { commonPropOptions } from '../../tooling/frame/prop-control.js';

export const propOptionsContent = {
  listStyle: ['insetGrouped', 'grouped', 'plain'] as const,
  header: [true, false] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  background: [undefined, 'grouped', 'plain'] as const,
};

// The guide pages' views (see overview.tsx, parts.tsx): the root's props,
// outlined by default (its own element's class name and style; it has no
// `render`).
export const propOptionsGuideRoot = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  background: [undefined, 'grouped', 'plain'] as const,
};

/** The overview's content: its list's style. */
export const propOptionsOverviewContent = {
  listStyle: ['insetGrouped', 'grouped', 'plain'] as const,
};
