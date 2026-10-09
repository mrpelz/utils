import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useTextFieldDemo } from './compose.js';
import { getPropOptionsControl, propOptionsRoot } from './props.js';

/**
 * A text field (Base UI Field, Framework7's iOS inputs) as a list row, its
 * label the row's title (see the form list for more).
 */
export const TextFieldDemo: FunctionComponent = () => {
  const id = 'text-field';

  const [log, addLog] = useLog();

  const { controls, props, Remounter, states, suggestions } = useTextFieldDemo(
    addLog,
    useProvidedState(id),
    {
      control: useMemo(() => getPropOptionsControl(addLog), [addLog]),
      root: propOptionsRoot,
    },
  );

  return (
    <Component
      stretch
      baseUiId="field"
      controls={controls}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, states)}
      title="Text Field"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <Remounter>
              <TextField.Root
                {...props.root}
                render={<List.Item />}
              >
                <TextField.Label {...props.label}>Name</TextField.Label>
                <TextField.Control {...props.control} />
                <TextField.Clear {...props.clear} />
                <TextField.Description {...props.description}>
                  As shown to others.
                </TextField.Description>
                <TextField.Error {...props.error}>
                  Please enter a name.
                </TextField.Error>
              </TextField.Root>
            </Remounter>
            {suggestions}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};
