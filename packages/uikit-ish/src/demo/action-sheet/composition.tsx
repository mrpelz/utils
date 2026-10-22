import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  ActionSheet,
  Button,
  Popover,
  useSizeClass,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { propOptionsPresentation } from './props.js';

const adaptiveCode = `// An action sheet in a compact width (iPhone), a popover in a regular one.
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
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(
    propOptionsPresentation,
    '[content]',
    external,
    true,
  );
  const sheet =
    (content.presentation ??
      (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet';

  return (
    <Component
      center
      inline
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Action sheet or popover"
    >
      {sheet ? (
        <div
          ref={screen}
          className="sheet-demo-phone"
        >
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
            <ActionSheet.Popup
              aria-label="Delete Photo"
              container={screen}
            >
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
        </div>
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
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [closing, setClosing] = useState(false);

  return (
    <Component
      center
      inline
      baseUiId="popover"
      id="action-sheet-composition-app"
      log={log}
      title="Action sheet opened by the app"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Button.Root
          size="large"
          variant="bordered"
          onClick={() => setClosing(true)}
        >
          <Button.Label>Close Draft</Button.Label>
        </Button.Root>
        <ActionSheet.Root
          open={closing}
          onOpenChange={(open: boolean, { reason }) => {
            addLog(`open change: ${String(open)} (${reason})`);
            setClosing(open);
          }}
        >
          <ActionSheet.Popup container={screen}>
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
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-popover-on-ipad', 'A popover on iPad'],
  ['opened-by-the-app', 'Opened by the app'],
];

/** `/action-sheet/composition`: action sheets with other components. */
export const ActionSheetComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="a-popover-on-ipad"
      level={2}
    >
      A popover on iPad
    </Heading>
    <ul>
      <li>
        In a regular width, iOS shows an action sheet as a popover (guide{' '}
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
    </ul>
    <OpenedByTheApp />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const actionSheetCompositionDemos = [APopoverOnIPad, OpenedByTheApp];
