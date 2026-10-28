import { FunctionComponent, useMemo } from 'react';

import { Roll } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'root',
  });
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsColumn(addLog), [addLog]),
    { external: externalColumn, isOpen: true, title: 'column (hours)' },
  );
  const [controlItem, propsItem, stateItem] = usePropControl(propOptionsItem, {
    external: externalItem,
    title: 'item (hours: 12)',
  });
  const [controlSeparator, propsSeparator, stateSeparator] = usePropControl(
    propOptionsSeparator,
    { external: externalSeparator, title: 'separator' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      controls={[controlRoot, controlColumn, controlItem, controlSeparator]}
      id={id}
      log={log}
      state={[stateRoot, stateColumn, stateItem, stateSeparator]}
      title="Roll"
    >
      <Roll.Root {...propsRoot}>
        <Roll.Column
          key={keyColumn}
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
