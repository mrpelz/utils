import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
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
  const [log, addLog] = useLog();

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    propOptionsRoot,
    'root',
    true,
  );
  const [controlLabel, propsLabel] = usePropControl(commonPropOptions, 'label');
  const [controlControl, propsControl] = usePropControl(
    useMemo(() => getPropOptionsControl(addLog), [addLog]),
    'control',
    true,
  );
  const [controlDescription, propsDescription] = usePropControl(
    commonPropOptions,
    'description',
  );
  const [controlError, propsError] = usePropControl(propOptionsError, 'error');
  const [controlClear, propsClear] = usePropControl(
    useMemo(() => getPropOptionsClear(addLog), [addLog]),
    'clear',
  );

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
        controlClear,
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
