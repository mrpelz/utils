import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { Properties } from 'csstype';

import type { SecondaryClickProps } from '../utils/main.js';

export type SegmentedRootProps = BaseRadioGroup.Props & {
  /** Hides the separators between unselected items. */
  hideSeparators?: boolean;
  /**
   * Too narrow for its items: their labels truncated (`truncate`), or the
   * items scrolled sideways (`scroll`, their labels whole: swiped; the
   * lens, held, dragging over them, scrolling them near an end).
   * @default 'truncate'
   */
  overflow?: 'scroll' | 'truncate';
};

export type SegmentedItemProps = BaseRadio.Root.Props &
  SecondaryClickProps & {
    /**
     * The cursor (where the pointer hovers).
     * @default 'pointer'
     */
    cursor?: Properties['cursor'];
  };
