import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol, Tooltip } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfSquareAndArrowUp } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
  propOptionsTrigger,
} from './props.js';

/**
 * A tooltip (Base UI's `Tooltip`): a short label at its trigger
 * on hover, keyboard focus and a long press on touch, or held open.
 */
export const TooltipDemo: FunctionComponent = () => {
  const id = 'tooltip';

  const [log, addLog] = useLog();

  const [externalRoot, externalTrigger, externalPositioner, externalContent] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    { external: externalTrigger, title: 'trigger' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    { external: externalPositioner, title: 'positioner' },
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': ['onClick', 'shape', 'size', 'variant'],
            'Tooltip.Popup': [],
            'Tooltip.Portal': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="tooltip"
      id={id}
      log={log}
      title="Tooltip"
      controls={[
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlContent,
        partControls,
      ]}
      state={[
        stateRoot,
        stateTrigger,
        statePositioner,
        stateContent,
        partState,
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
                {...partProps['Button.Root']}
                shape="circle"
                size="large"
                variant="glass"
                onClick={() => addLog('click')}
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndArrowUp}
              />
            </Button.Icon>
          </Tooltip.Trigger>
          <Tooltip.Portal {...partProps['Tooltip.Portal']}>
            <Tooltip.Positioner {...propsPositioner}>
              <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                {propsContent.text}
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Component>
  );
};
