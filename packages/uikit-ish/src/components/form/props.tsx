import type { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';

import type { ListHeaderProps } from '../list/main.js';

export type FieldsetLegendProps = Omit<BaseFieldset.Legend.Props, 'ref'> &
  Pick<ListHeaderProps, 'prominence'>;
