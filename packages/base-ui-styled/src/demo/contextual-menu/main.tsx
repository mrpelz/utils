import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { styled } from 'goober';
import { FunctionComponent, useMemo } from 'react';

import { Button, ContextualMenu } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
  propOptionsPreview,
  propOptionsTrigger,
} from './props.js';

// A photo (its own size, as an image's), what the menu acts on.
const Photo = styled('div')`
  display: grid;
  padding: 72px 96px;
  border-radius: 16px;
  background-image: linear-gradient(
    135deg,
    var(--color-ios-system-orange),
    var(--color-ios-system-pink)
  );
  color: #fff;
  font-size: 48px;
  place-items: center;
`;

/**
 * A contextual menu (UIKit `UIContextMenuInteraction`): opening, the
 * trigger lifts (as far as the menu needs to fit below it), turning into a
 * preview of the photo the menu acts on.
 */
export const ContextualMenuDemo: FunctionComponent = () => {
  const id = 'contextual-menu';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalTrigger,
    externalPreview,
    externalPositioner,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

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

  const [controlPreview, propsPreview, statePreview] = usePropControl(
    propOptionsPreview,
    'preview',
    externalPreview,
  );

  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
  );

  const action = (label: string) => () => addLog(`${label} clicked`);

  return (
    <Component
      center
      id={id}
      log={log}
      title="Contextual Menu"
      controls={[
        controlContent,
        controlRoot,
        controlTrigger,
        controlPreview,
        controlPositioner,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateTrigger,
        statePreview,
        statePositioner,
      ])}
    >
      <RemounterRoot>
        <ContextualMenu.Root {...propsRoot}>
          <ContextualMenu.Trigger
            {...propsTrigger}
            render={<Button.Root variant="bordered" />}
          >
            <Button.Symbol>
              <SFSymbol icon={sfPhoto} />
            </Button.Symbol>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          {content.preview ? (
            <ContextualMenu.Preview {...propsPreview}>
              <Photo aria-label="Photo">
                <SFSymbol icon={sfPhoto} />
              </Photo>
            </ContextualMenu.Preview>
          ) : null}
          <ContextualMenu.Portal>
            {content.backdrop ? <ContextualMenu.Backdrop /> : null}
            <ContextualMenu.Positioner {...propsPositioner}>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={action('Share')}>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                  <ContextualMenu.Icon>
                    <SFSymbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
                <ContextualMenu.Item onClick={action('Copy')}>
                  <ContextualMenu.Label>Copy</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
                <ContextualMenu.Item
                  destructive
                  onClick={action('Delete')}
                >
                  <ContextualMenu.Label>Delete</ContextualMenu.Label>
                  <ContextualMenu.Icon>
                    <SFSymbol icon={sfTrash} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </RemounterRoot>
    </Component>
  );
};
