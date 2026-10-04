import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../components/index.js';
import { useLog } from './utils/log.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  usePropControl,
} from './utils/main.js';

const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  invalid: [undefined, false, true] as const,
  validationMode: [undefined, 'onSubmit', 'onBlur', 'onChange'] as const,
};

const propOptionsControl = {
  ...commonPropOptions,
  placeholder: ['Name', undefined, 'A longer placeholder'] as const,
  defaultValue: [undefined, 'Kate Bell'] as const,
  type: [undefined, 'text', 'email', 'password', 'number'] as const,
  required: [undefined, false, true] as const,
  render: [undefined, new MappedProp(<textarea />, '[<textarea />]')] as const,
};

/**
 * A text field (Base UI Field, Framework7's iOS inputs) as a list row, its
 * label the row's title (see the form list for more).
 */
export const TextFieldDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    propOptionsRoot,
    'root',
    true,
  );
  const [controlLabel, propsLabel] = usePropControl(commonPropOptions, 'label');
  const [controlControl, propsControl] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsControl,
        onValueChange: [
          undefined,
          new MappedProp(
            (value: string) => addLog(`value change: ${value}`),
            '[log change]',
          ),
        ] as const,
      }),
      [addLog],
    ),
    'control',
    true,
  );
  const [controlDescription, propsDescription] = usePropControl(
    commonPropOptions,
    'description',
  );
  const [controlError, propsError] = usePropControl(commonPropOptions, 'error');

  return (
    <Component
      stretch
      baseUiId="field"
      id="text-field"
      log={log}
      title="Text Field"
      controls={[
        controlRoot,
        controlLabel,
        controlControl,
        controlDescription,
        controlError,
      ]}
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <RemounterRoot>
              <TextField.Root
                {...propsRoot}
                render={<List.Item />}
              >
                <TextField.Label {...propsLabel}>Name</TextField.Label>
                <TextField.Control {...propsControl} />
                <TextField.Clear />
                <TextField.Description {...propsDescription}>
                  As shown to others.
                </TextField.Description>
                <TextField.Error {...propsError}>
                  Please enter a name.
                </TextField.Error>
              </TextField.Root>
            </RemounterRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};
