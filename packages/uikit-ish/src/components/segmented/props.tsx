import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { Properties } from 'csstype';

import type { SecondaryClickProps } from '../utils/main.js';

export type SegmentedRootProps = BaseRadioGroup.Props & {
  /** Hides the separators between unselected items. */
  hideSeparators?: boolean;
};

export type SegmentedItemProps = BaseRadio.Root.Props &
  SecondaryClickProps & {
    /**
     * The cursor (where the pointer hovers).
     * @default 'pointer'
     */
    cursor?: Properties['cursor'];
  };
