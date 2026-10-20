import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Checkbox, Radio, RadioGroup } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useCreateStateUrl, useProvidedState } from '../frame/state.js';
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
    'Checkbox.Root',
    externalCheckbox,
    true,
  );

  return (
    <Component
      center
      baseUiId="checkbox"
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
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
    'RadioGroup',
    externalGroup,
    true,
  );
  const [controlRadio, propsRadio, stateRadio] = usePropControl(
    propOptionsRadio,
    'Radio.Root (email)',
    externalRadio,
  );

  return (
    <Component
      center
      baseUiId="radio"
      controls={[controlGroup, controlRadio]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateGroup, stateRadio])}
      title="Checkbox (Radio)"
    >
      <RadioGroup
        key={elementKey}
        aria-label="Contact by"
        {...propsGroup}
      >
        <div className="checkbox-demo-group">
          <label className="checkbox-demo-option">
            <Radio.Root
              value="email"
              {...propsRadio}
            />
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
