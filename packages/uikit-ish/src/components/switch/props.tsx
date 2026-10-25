import type { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { Properties } from 'csstype';

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
  /** Shows “I” and “O” on the track (UIKit's “On/Off Labels”). */
  onOffLabels?: boolean;
  /**
   * The track's color while on, and the pressed knob's glow (UIKit
   * `onTintColor`).
   * @default `systemGreen`
   */
  tint?: string;
};

export type Drag = {
  direction: 1 | -1;
  isChecked: boolean;
  isFlipped: boolean;
  max: number;
  min: number;
  moved: number;
  start: number;
  startTime: number;
  startX: number;
};
