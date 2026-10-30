import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  ActionSheet,
  Button,
  Popover,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { propOptionsPresentation } from './props.js';

const adaptiveCode = `// An action sheet in a compact width, a popover in a regular one.
const sheet = useSizeClass() === 'compact';

sheet ? (
  <ActionSheet.Root>
    <ActionSheet.Trigger render={<Button.Root />}>…</ActionSheet.Trigger>
    <ActionSheet.Popup>
      <ActionSheet.Actions>…</ActionSheet.Actions>
    </ActionSheet.Popup>
  </ActionSheet.Root>
) : (
  <Popover.Root>
    <Popover.Trigger render={<Button.Root />}>…</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <Popover.Arrow />
          <Popover.Body>
            {/* the same actions: they close the popover */}
            <ActionSheet.Actions>…</ActionSheet.Actions>
          </Popover.Body>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);`;

/**
 * Deleting a photo: an action sheet (a compact width), or a popover (a
 * regular one; or as set), the same actions.
 */
const APopoverOnIPad: FunctionComponent = () => {
  const id = 'action-sheet-composition-popover';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(propOptionsPresentation, {
    external,
    isOpen: true,
    title: '[content]',
  });
  const isSheet =
    (content.presentation ??
      (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet';

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[state]}
      title="Action sheet or popover"
    >
      {isSheet ? (
        <Viewport.Content>
          <ActionSheet.Root>
            <ActionSheet.Trigger
              render={
                <Button.Root
                  size="large"
                  variant="bordered"
                />
              }
            >
              <Button.Label>Delete Photo</Button.Label>
            </ActionSheet.Trigger>
            <ActionSheet.Popup aria-label="Delete Photo">
              <ActionSheet.Actions>
                <ActionSheet.Action
                  variant="destructive"
                  onClick={() => addLog('action: delete photo')}
                >
                  Delete Photo
                </ActionSheet.Action>
                <ActionSheet.Action
                  onClick={() => addLog('action: remove from album')}
                >
                  Remove from Album
                </ActionSheet.Action>
              </ActionSheet.Actions>
            </ActionSheet.Popup>
          </ActionSheet.Root>
        </Viewport.Content>
      ) : (
        <Popover.Root>
          <Popover.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup
                aria-label="Delete Photo"
                className="action-sheet-demo-popup"
              >
                <Popover.Arrow />
                <Popover.Body>
                  <ActionSheet.Actions>
                    <ActionSheet.Action
                      variant="destructive"
                      onClick={() => addLog('action: delete photo')}
                    >
                      Delete Photo
                    </ActionSheet.Action>
                    <ActionSheet.Action
                      onClick={() => addLog('action: remove from album')}
                    >
                      Remove from Album
                    </ActionSheet.Action>
                  </ActionSheet.Actions>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};

/** A draft closed: the app opens the sheet (`open`), at the bottom. */
const OpenedByTheApp: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isClosing, setIsClosing] = useState(false);

  return (
    <Component
      isInline
      baseUiId="popover"
      id="action-sheet-composition-app"
      log={log}
      screen="centered"
      stage="phone"
      title="Action sheet opened by the app"
    >
      <Viewport.Content>
        <Button.Root
          size="large"
          variant="bordered"
          onClick={() => setIsClosing(true)}
        >
          <Button.Label>Close Draft</Button.Label>
        </Button.Root>
        <ActionSheet.Root
          open={isClosing}
          onOpenChange={(isOpen: boolean, { reason }) => {
            addLog(`open change: ${String(isOpen)} (${reason})`);
            setIsClosing(isOpen);
          }}
        >
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Save Draft?</ActionSheet.Title>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action
                variant="destructive"
                onClick={() => addLog('action: delete draft')}
              >
                Delete Draft
              </ActionSheet.Action>
              <ActionSheet.Action onClick={() => addLog('action: save draft')}>
                Save Draft
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-popover-in-a-regular-width', 'A popover in a regular width'],
  ['opened-by-the-app', 'Opened by the app'],
];

/** `/action-sheet/composition`: action sheets with other components. */
export const ActionSheetComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="a-popover-in-a-regular-width"
      level={2}
    >
      A popover in a regular width
    </Heading>
    <ul>
      <li>
        In a regular width, an action sheet shows as a popover (guide{' '}
        <a href="hig-guide#rule-a6">A6</a>): the app’s choice here, by{' '}
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ; a <a href="popover">Popover</a> with an arrow, the same{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Actions"
        />{' '}
        in its body (an action closes either).
      </li>
      <li>Resize the window, or choose the presentation.</li>
      <li>
        <strong>Library:</strong> the action sheet (
        <PartLink
          component="action-sheet"
          part="ActionSheet.Root"
        />
        , its trigger, actions and popup), the popover with its arrow (
        <PartLink
          component="popover"
          part="Popover.Popup"
        />
        ,{' '}
        <PartLink
          component="popover"
          part="Popover.Arrow"
        />
        ), and the window’s size class (<code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> choosing between the two by the size class (or
        the presentation control), the same actions written into both, and
        logging which was chosen.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <APopoverOnIPad />

    <Heading
      id="opened-by-the-app"
      level={2}
    >
      Opened by the app
    </Heading>
    <ul>
      <li>
        No trigger: the app opens it (<code>open</code>, its state), e.g. as a
        draft is closed; it shows at its container’s bottom, above its safe
        area.
      </li>
      <li>
        Its actions, a press outside, or Escape close it (
        <code>onOpenChange</code>, with why).
      </li>
      <li>
        <strong>Library:</strong> opening without a trigger (<code>open</code>),
        placing it at its container’s bottom above the safe area, and closing it
        by an action, a press outside or Escape (<code>onOpenChange</code>, with
        why).
      </li>
      <li>
        <strong>Demo:</strong> the open state and when it’s set (closing the
        draft), and what each action does (logged).
      </li>
    </ul>
    <OpenedByTheApp />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const actionSheetCompositionDemos = [APopoverOnIPad, OpenedByTheApp];
