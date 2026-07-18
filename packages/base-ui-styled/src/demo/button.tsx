import { FunctionComponent } from 'preact';

import { Button } from '../components/index.js';
import {
  commonPropOptions,
  ComponentEntry,
  MappedProp,
  Story,
  usePropControl,
} from './utils.js';

const propOptions = {
  ...commonPropOptions,
  children: ['Label'] as const,
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
  nativeButton: [undefined, false, true] as const,
  'styled-cursor': [undefined, 'auto', 'pointer', 'copy'] as const,
  onClick: [
    // eslint-disable-next-line no-alert
    new MappedProp(() => alert('alert!'), 'alert!'),
    undefined,
  ] as const,
};

export const ButtonDemo: FunctionComponent = () => {
  const [control, props] = usePropControl(propOptions);

  return (
    <ComponentEntry
      id="button"
      name="Button"
    >
      <Story control={control}>
        <Button {...props} />
      </Story>
    </ComponentEntry>
  );
};
