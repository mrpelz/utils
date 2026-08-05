import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Checkbox } from '../components/checkbox.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from '../demo-utils/main.js';

const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, true, false],
  nativeButton: [undefined, true, false],
} as const;

export const CheckboxDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [controlRoot, propsRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onCheckedChange: [
          new MappedProp(
            (
              checked: boolean,
              { reason }: BaseCheckbox.Root.ChangeEventDetails,
            ) => addLog(`checked change: ${checked}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
  );

  return (
    <Component
      backdrop
      center
      controls={controlRoot}
      id="checkbox"
      log={log}
      title="Checkbox"
    >
      <Checkbox.Root {...propsRoot}>
        <Checkbox.Indicator>
          <Checkbox.Icon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </Component>
  );
};
