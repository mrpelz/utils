import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Checkbox, Radio, RadioGroup } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsCheckbox,
  getPropOptionsRadioGroup,
  propOptionsRadio,
} from './props.js';

/**
 * A checkbox (Base UI's, as iOS selection circles): unchecked, checked, or
 * mixed (indeterminate).
 */
export const CheckboxDemo: FunctionComponent = () => {
  const id = 'checkbox';

  const [log, addLog] = useLog();
  const [externalCheckbox] = useProvidedState(id);

  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCheckbox(addLog), [addLog]),
    { external: externalCheckbox, open: true, title: 'Checkbox.Root' },
  );

  return (
    <Component
      center
      baseUiId="checkbox"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Checkbox"
    >
      <Checkbox.Root
        key={elementKey}
        aria-label="Selected"
        {...props}
      />
    </Component>
  );
};

/** Radios in a group (Base UI's), as selection circles: one selected. */
export const CheckboxRadioDemo: FunctionComponent = () => {
  const id = 'checkbox-radio';

  const [log, addLog] = useLog();
  const [externalGroup, externalRadio] = useProvidedState(id);

  const [controlGroup, propsGroup, stateGroup, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    { external: externalGroup, open: true, title: 'RadioGroup' },
  );
  const [controlRadio, propsRadio, stateRadio] = usePropControl(
    propOptionsRadio,
    { external: externalRadio, title: 'Radio.Root (email)' },
  );

  return (
    <Component
      center
      baseUiId="radio"
      controls={[controlGroup, controlRadio]}
      id={id}
      log={log}
      state={[stateGroup, stateRadio]}
      title="Checkbox (Radio)"
    >
      <RadioGroup
        key={elementKey}
        aria-label="Contact by"
        {...propsGroup}
      >
        <div className="checkbox-demo-group">
          <label className="checkbox-demo-option">
            <Radio.Root {...propsRadio} />
            Email
          </label>
          <label className="checkbox-demo-option">
            <Radio.Root value="phone" />
            Phone
          </label>
          <label className="checkbox-demo-option">
            <Radio.Root value="mail" />
            Mail
          </label>
        </div>
      </RadioGroup>
    </Component>
  );
};
