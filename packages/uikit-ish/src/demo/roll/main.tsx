import { FunctionComponent, useMemo } from 'react';

import { Roll } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  fruits,
  getPropOptionsColumn,
  hours,
  minutes,
  propOptionsItem,
  propOptionsRoot,
  propOptionsSeparator,
} from './props.js';

/**
 * A roll (UIKit `UIPickerView`): hours and minutes (editable: press the
 * selected row, or type, to enter a number), and a column of text with a
 * disabled row (“Durian”: settling on it moves on).
 */
export const RollDemo: FunctionComponent = () => {
  const id = 'roll';

  const [log, addLog] = useLog();

  const [externalRoot, externalColumn, externalItem, externalSeparator] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsColumn(addLog), [addLog]),
    'column (hours)',
    externalColumn,
    true,
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    propOptionsItem,
    'item (hours: 12)',
    externalItem,
  );
  const [controlSeparator, propsSeparator, stateSeparator] = usePropControl(
    propOptionsSeparator,
    'separator',
    externalSeparator,
  );

  return (
    <Component
      center
      inputGuards
      controls={[controlRoot, controlColumn, controlItem, controlSeparator]}
      id={id}
      log={log}
      state={[stateRoot, stateColumn, stateItem, stateSeparator]}
      title="Roll"
    >
      <Roll.Root {...propsRoot}>
        <Roll.Column
          key={keyColumn}
          aria-label="Hours"
          {...propsColumn}
        >
          {hours.map((hour) => (
            <Roll.Item
              key={hour}
              value={hour}
              {...(hour === 12 ? propsItem : {})}
            />
          ))}
        </Roll.Column>
        <Roll.Separator
          aria-hidden="true"
          {...propsSeparator}
        >
          :
        </Roll.Separator>
        <Roll.Column
          editable
          aria-label="Minutes"
          defaultValue={41}
          onValueChange={(value) => addLog(`minutes: ${String(value)}`)}
        >
          {minutes.map((minute) => (
            <Roll.Item
              key={minute}
              value={minute}
            >
              {String(minute).padStart(2, '0')}
            </Roll.Item>
          ))}
        </Roll.Column>
        <Roll.Column
          align="start"
          aria-label="Fruit"
          defaultValue="Cherry"
          onValueChange={(value) => addLog(`fruit: ${String(value)}`)}
        >
          {fruits.map((fruit) => (
            <Roll.Item
              key={fruit}
              disabled={fruit === 'Durian'}
              value={fruit}
            />
          ))}
        </Roll.Column>
      </Roll.Root>
    </Component>
  );
};
