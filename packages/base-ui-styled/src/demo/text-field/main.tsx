import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getPropOptionsClear,
  getPropOptionsControl,
  propOptionsError,
  propOptionsRoot,
} from './props.js';

/**
 * A text field (Base UI Field, Framework7's iOS inputs) as a list row, its
 * label the row's title (see the form list for more).
 */
export const TextFieldDemo: FunctionComponent = () => {
  const id = 'text-field';

  const [log, addLog] = useLog();

  const [
    externalRoot,
    externalLabel,
    externalControl,
    externalClear,
    externalDescription,
    externalError,
  ] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'label',
    externalLabel,
  );
  const [controlControl, propsControl, stateControl] = usePropControl(
    useMemo(() => getPropOptionsControl(addLog), [addLog]),
    'control',
    externalControl,
    true,
  );
  const [controlDescription, propsDescription, stateDescription] =
    usePropControl(commonPropOptions, 'description', externalDescription);
  const [controlError, propsError, stateError] = usePropControl(
    propOptionsError,
    'error',
    externalError,
  );
  const [controlClear, propsClear, stateClear] = usePropControl(
    useMemo(() => getPropOptionsClear(addLog), [addLog]),
    'clear',
    externalClear,
  );

  return (
    <Component
      stretch
      baseUiId="field"
      id={id}
      log={log}
      title="Text Field"
      controls={[
        controlRoot,
        controlLabel,
        controlControl,
        controlClear,
        controlDescription,
        controlError,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        stateLabel,
        stateControl,
        stateClear,
        stateDescription,
        stateError,
      ])}
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
                <TextField.Clear {...propsClear} />
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
