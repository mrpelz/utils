import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonPopover } from '../common.js';

const Positioner = styled(BasePopover.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
`;

export const controlledModeWithMultipleTriggers = {
  ...CommonPopover,
  Positioner,
};
