import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsClear,
  getPropOptionsControl,
  propOptionsError,
  propOptionsRoot,
  suggestionsId,
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

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, open: true, title: 'root' },
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    { external: externalLabel, title: 'label' },
  );
  const [controlControl, propsControl, stateControl, keyControl] =
    usePropControl(
      useMemo(() => getPropOptionsControl(addLog), [addLog]),
      { external: externalControl, open: true, title: 'control' },
    );
  const [controlClear, propsClear, stateClear] = usePropControl(
    useMemo(() => getPropOptionsClear(addLog), [addLog]),
    { external: externalClear, title: 'clear' },
  );
  const [controlDescription, propsDescription, stateDescription] =
    usePropControl(commonPropOptions, {
      external: externalDescription,
      title: 'description',
    });
  const [controlError, propsError, stateError] = usePropControl(
    propOptionsError,
    { external: externalError, title: 'error' },
  );

  return (
    <Component
      inputGuards
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
      state={[
        stateRoot,
        stateLabel,
        stateControl,
        stateClear,
        stateDescription,
        stateError,
      ]}
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <TextField.Root
              key={`${keyRoot}-${keyControl}`}
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
          </List.Group>
        </List.Section>
        {/* The suggestions of the control's `list` option. */}
        <datalist id={suggestionsId}>
          <option value="Kate Bell" />
          <option value="John Appleseed" />
          <option value="Anna Haro" />
        </datalist>
      </List.Root>
    </Component>
  );
};
