import type { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { Properties } from 'csstype';

import type { DelayedLens } from '../utils/main.js';

export type SwitchRootProps = BaseSwitch.Root.Props & {
  /**
   * The cursor (where the pointer hovers).
   * @default 'pointer' (disabled: 'not-allowed')
   */
  cursor?: Properties['cursor'];
  /**
   * Neither on nor off (as a checkbox's `indeterminate`, also of the hidden
   * input): the knob in the middle. Toggling still flips `checked`.
   */
  indeterminate?: boolean;
  /** Shows “I” and “O” on the track (on/off labels). */
  onOffLabels?: boolean;
  /**
   * The track's color while on, and the pressed knob's glow.
   * @default `systemGreen`
   */
  tint?: string;
};

export type Drag = {
  direction: 1 | -1;
  isChecked: boolean;
  isFlipped: boolean;
  /** Its knob's lens, shown a moment into the press (see `delayLens`). */
  lens: DelayedLens;
  max: number;
  min: number;
  moved: number;
  start: number;
  startTime: number;
  startX: number;
};
