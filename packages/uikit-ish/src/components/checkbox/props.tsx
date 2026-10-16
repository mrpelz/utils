import type { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { Properties } from 'csstype';

export type CursorProps = {
  /**
   * As `Button`: the cursor.
   * @default 'pointer' (disabled: 'not-allowed')
   */
  cursor?: Properties['cursor'];
  disabled?: boolean;
};

export type CheckboxRootProps = Omit<BaseCheckbox.Root.Props, 'ref'> &
  CursorProps;

export type RadioRootProps = Omit<BaseRadio.Root.Props, 'ref'> & CursorProps;
