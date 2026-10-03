import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { FunctionComponent, useMemo } from 'react';

import { Switch } from '../components/index.js';
import { useLog } from './utils/log.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  usePropControl,
} from './utils/main.js';

const propOptionsRoot = {
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};

const propOptionsThumb = {
  ...commonPropOptions,
};

export const SwitchDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onCheckedChange: [
          new MappedProp(
            (
              checked: boolean,
              { reason }: BaseSwitch.Root.ChangeEventDetails,
            ) => addLog(`checked change: ${checked}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
        inputRef: [
          undefined,
          new MappedProp(
            (element: HTMLInputElement | null) =>
              addLog(`input ref: ${element?.type ?? 'null'}`),
            '[log ref]',
          ),
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlThumb, propsThumb] = usePropControl(propOptionsThumb, 'thumb');

  return (
    <Component
      center
      baseUiId="switch"
      controls={[controlRoot, controlThumb]}
      id="switch"
      log={log}
      title="Switch"
    >
      <RemounterRoot>
        <Switch.Root {...propsRoot}>
          <Switch.Thumb {...propsThumb} />
        </Switch.Root>
      </RemounterRoot>
    </Component>
  );
};
