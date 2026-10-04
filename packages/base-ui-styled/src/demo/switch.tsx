import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { FunctionComponent, useMemo, useState } from 'react';

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
  indeterminate: [undefined, false, true] as const,
  onOffLabels: [undefined, false, true] as const,
  tint: [
    undefined,
    'var(--color-ios-system-blue)',
    'var(--color-ios-system-orange)',
    '#000',
  ] as const,
};

const propOptionsThumb = {
  ...commonPropOptions,
};

export const SwitchDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state), once the knob has moved over.
  const [pending, setPending] = useState(false);

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(() => {
      const timer: { timeout?: ReturnType<typeof setTimeout> } = {};

      return {
        ...propOptionsRoot,
        onCheckedChange: [
          new MappedProp(
            (
              checked: boolean,
              { reason }: BaseSwitch.Root.ChangeEventDetails,
            ) => addLog(`checked change: ${checked}/${reason}`),
            '[log change]',
          ),
          new MappedProp(
            (
              checked: boolean,
              { reason }: BaseSwitch.Root.ChangeEventDetails,
            ) => {
              addLog(`checked change: ${checked}/${reason}, indeterminate`);
              setPending(true);
              clearTimeout(timer.timeout);
              timer.timeout = setTimeout(() => {
                addLog('indeterminate: false');
                setPending(false);
              }, 2000);
            },
            '[indeterminate for 2s]',
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
      };
    }, [addLog]),
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
        <Switch.Root
          {...propsRoot}
          indeterminate={propsRoot.indeterminate ?? pending}
        >
          <Switch.Thumb {...propsThumb} />
        </Switch.Root>
      </RemounterRoot>
    </Component>
  );
};
