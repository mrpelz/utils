import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol, Tooltip } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
  propOptionsTrigger,
} from './props.js';

/**
 * A tooltip (Base UI's `Tooltip`, no Figma): a short label at its trigger
 * on hover and keyboard focus (not on touch), or held open.
 */
export const TooltipDemo: FunctionComponent = () => {
  const id = 'tooltip';

  const [log, addLog] = useLog();

  const [externalRoot, externalTrigger, externalPositioner, externalContent] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    'trigger',
    externalTrigger,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      baseUiId="tooltip"
      id={id}
      log={log}
      state={[stateRoot, stateTrigger, statePositioner, stateContent]}
      title="Tooltip"
      controls={[
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlContent,
      ]}
    >
      <div style={{ paddingBlock: 64 }}>
        <Tooltip.Root
          key={`${keyRoot}`}
          {...propsRoot}
        >
          <Tooltip.Trigger
            aria-label="Share"
            {...propsTrigger}
            render={
              <Button.Root
                shape="circle"
                size="large"
                variant="glass"
                onClick={() => addLog('click')}
              />
            }
          >
            <Button.Icon>
              <Symbol icon={sfSquareAndArrowUp} />
            </Button.Icon>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner {...propsPositioner}>
              <Tooltip.Popup>{propsContent.text}</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Component>
  );
};
