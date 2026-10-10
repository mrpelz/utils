import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { FunctionComponent, useMemo } from 'react';

import { Button, Tooltip } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, Remounters, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
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

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
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
      title="Tooltip"
      controls={[
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlContent,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        stateTrigger,
        statePositioner,
        stateContent,
      ])}
    >
      <div style={{ paddingBlock: 64 }}>
        <Remounters remounters={[RemounterRoot]}>
          <Tooltip.Root {...propsRoot}>
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
              <Button.Symbol>
                <SFSymbol icon={sfSquareAndArrowUp} />
              </Button.Symbol>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner {...propsPositioner}>
                <Tooltip.Popup>{propsContent.text}</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Remounters>
      </div>
    </Component>
  );
};
