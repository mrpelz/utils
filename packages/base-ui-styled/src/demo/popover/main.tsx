import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { FunctionComponent, useMemo } from 'react';

import { Button, List, Popover, Symbol } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
} from './props.js';

/**
 * A popover (UIKit `UIPopoverPresentationController`, Figma “Popovers”, Base
 * UI's `Popover`): a panel at its trigger, its arrow pointing at it; in a
 * list row, aligned with its end.
 */
export const PopoverDemo: FunctionComponent = () => {
  const id = 'popover';

  const [log, addLog] = useLog();

  const [externalRoot, externalPositioner, externalContent] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
    true,
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const panel = (
    <Popover.Portal>
      <Popover.Positioner {...propsPositioner}>
        <Popover.Popup>
          {propsContent.arrow ? <Popover.Arrow /> : null}
          <div style={{ maxWidth: 280, padding: 16 }}>
            <Popover.Title
              style={{ font: 'inherit', fontWeight: 600, margin: 0 }}
            >
              Popover
            </Popover.Title>
            <Popover.Description style={{ margin: '4px 0 0' }}>
              A transient view above other content, at the control that showed
              it.
            </Popover.Description>
          </div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );

  return (
    <Component
      center
      baseUiId="popover"
      controls={[controlRoot, controlPositioner, controlContent]}
      id={id}
      log={log}
      title="Popover"
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        statePositioner,
        stateContent,
      ])}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          gap: 32,
          justifyItems: 'center',
          paddingBlock: 16,
          width: 'min(402px, 100%)',
        }}
      >
        <Popover.Root
          key={`${keyRoot}`}
          {...propsRoot}
        >
          <Popover.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Show Popover</Button.Label>
          </Popover.Trigger>
          {panel}
        </Popover.Root>
        <List.Root style={{ width: '100%' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>In a row</List.Title>
                <Popover.Root>
                  <Popover.Trigger
                    aria-label="Info"
                    render={
                      <Button.Root
                        shape="circle"
                        variant="borderless"
                      />
                    }
                  >
                    <Button.Icon>
                      <Symbol icon={sfICircle} />
                    </Button.Icon>
                  </Popover.Trigger>
                  {panel}
                </Popover.Root>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};
