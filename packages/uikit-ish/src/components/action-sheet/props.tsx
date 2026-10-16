import type { Dialog as BaseDialog } from '@base-ui/react/dialog';

import type { AlertActionVariant } from '../alert/main.js';

export type ActionSheetActionProps = Omit<BaseDialog.Close.Props, 'ref'> & {
  /**
   * Figma “Type”.
   * @default 'secondary'
   */
  variant?: AlertActionVariant;
};
