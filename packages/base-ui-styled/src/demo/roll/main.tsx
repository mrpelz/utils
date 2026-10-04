import { FunctionComponent, useMemo } from 'react';

import { Roll } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
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
  const [log, addLog] = useLog();

  const [controlRoot, propsRoot] = usePropControl(propOptionsRoot, 'root');
  const [controlColumn, propsColumn, RemounterColumn] = usePropControl(
    useMemo(() => getPropOptionsColumn(addLog), [addLog]),
    'column (hours)',
    true,
  );
  const [controlItem, propsItem] = usePropControl(
    propOptionsItem,
    'item (hours: 12)',
  );
  const [controlSeparator, propsSeparator] = usePropControl(
    propOptionsSeparator,
    'separator',
  );

  return (
    <Component
      center
      controls={[controlRoot, controlColumn, controlItem, controlSeparator]}
      id="roll"
      log={log}
      title="Roll"
    >
      <Roll.Root {...propsRoot}>
        <RemounterColumn>
          <Roll.Column
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
        </RemounterColumn>
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
