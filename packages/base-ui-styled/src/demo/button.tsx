import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Button } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const propOptions = {
  ...commonPropOptions,
  children: ['Label'] as const,
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
  nativeButton: [undefined, false, true] as const,
  'styled-cursor': [undefined, 'auto', 'pointer', 'copy'] as const,
};

export const ButtonDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [control, props, Remounter] = usePropControl(
    useMemo(
      () => ({
        ...propOptions,
        onClick: [
          new MappedProp(() => addLog('button has been clicked'), 'log click'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
  );

  return (
    <Component
      center
      controls={control}
      id="button"
      log={log}
      title="Button"
    >
      <Remounter>
        <Button {...props} />
      </Remounter>
    </Component>
  );
};
