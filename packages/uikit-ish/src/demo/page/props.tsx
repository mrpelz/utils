import { commonPropOptions } from '../frame/prop-control.js';

export const propOptionsContent = {
  listStyle: ['insetGrouped', 'grouped', 'plain'] as const,
  header: [true, false] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  background: [undefined, 'grouped', 'plain'] as const,
};
