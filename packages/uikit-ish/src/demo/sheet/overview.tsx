import { FunctionComponent, useRef } from 'react';

import { Button, List, Sheet, Toolbar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import { sheetPopupRows, sheetRootRows } from './docs.js';
import {
  propOptionsGuideRoot,
  propOptionsOverviewContent,
  propOptionsOverviewPopup,
} from './props.js';

/**
 * A phone's screen (or a tablet's): a button presenting a sheet, its
 * header's Cancel and Done, its list.
 */
const LiveView: FunctionComponent = () => {
  const id = 'sheet-overview';
  const [log, addLog] = useLog();
  const screen = useRef<HTMLDivElement>(null);
  const [externalContent, externalRoot, externalPopup] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsGuideRoot,
    'Sheet.Root',
    externalRoot,
    true,
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsOverviewPopup,
    'Sheet.Popup',
    externalPopup,
    true,
  );
  const tablet = content.layout === 'tablet';

  return (
    <Component
      center
      inline
      controls={[controlContent, controlRoot, controlPopup]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePopup]}
      title="Sheet"
    >
      <div
        ref={screen}
        className={tablet ? 'sheet-demo-tablet' : 'sheet-demo-phone'}
      >
        <Sheet.Root
          key={keyRoot}
          {...propsRoot}
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact={!tablet}
            container={screen}
            {...propsPopup}
          >
            <Sheet.Header>
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close
                    render={
                      <Toolbar.Button
                        prominent
                        onClick={() => addLog('Done clicked')}
                      />
                    }
                  >
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 5).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/sheet`: what a sheet is for, and its props. */
export const SheetOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A focused task over the page (UIKit{' '}
        <code>UISheetPresentationController</code>; Base UI’s{' '}
        <code>Dialog</code>): from the bottom on a phone, large or medium; a
        form sheet, centered, on a tablet.
      </li>
      <li>
        Modal, the page dimmed behind it; dismissed by its buttons, a press
        outside it, Escape, or dragged down by its header.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        A task of its own that keeps its parent in view: composing a message,
        adding a contact, editing details (Cancel and Done).
      </li>
      <li>
        A few options or details for the page (medium: its content’s height),
        e.g. a share sheet, filters.
      </li>
      <li>
        A task of several steps: a <a href="navigation">Navigation</a> inside it
        (see <a href="sheet/composition">Composition</a>).
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A choice of a few actions: an <a href="action-sheet">Action sheet</a>; a
        question that must be answered: an <a href="alert">Alert</a>.
      </li>
      <li>
        Something tied to a control (a tablet’s): a{' '}
        <a href="popover">Popover</a>, a <a href="menu">Menu</a>.
      </li>
      <li>
        Going deeper in the app’s content: a push in a{' '}
        <a href="navigation">Navigation</a>, not a sheet.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most sheets set, across their parts.</li>
      <li>
        All parts’ props: <a href="sheet/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Sheet.Root',
          pickRows(
            sheetRootRows,
            'open',
            'onOpenChange',
            'disablePointerDismissal',
          ),
        ],
        ['Sheet.Popup', pickRows(sheetPopupRows, 'detent', 'compact')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        A <code>dialog</code> (modal: <code>aria-modal</code>), named by its{' '}
        <code>Sheet.Title</code>, described by its{' '}
        <code>Sheet.Description</code>.
      </li>
      <li>
        Opened, focus moves into it (by touch: to the sheet itself, not opening
        the keyboard), trapped while it’s open; closed, back to its trigger.
      </li>
      <li>
        Escape closes it; give it a button that does too (a{' '}
        <code>Sheet.Close</code>): dragging its header is a pointer gesture
        only.
      </li>
      <li>The page behind it is inert and doesn’t scroll while it’s open.</li>
      <li>
        Its slide and fade (350ms) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        Large: the whole screen but 10px at the top, opaque, its top corners
        38px. Medium: a glass panel 6px from the sides and the bottom, as high
        as its content.
      </li>
      <li>
        Not compact (the window from 768px, or <code>compact={'{false}'}</code>
        ): a form sheet, centered, up to 936px by 852px.
      </li>
      <li>
        Slides up as it opens, the page dimmed (20%; dark: 48%) behind it.
      </li>
      <li>
        Dragged down by its header (its grabber, its bar but its buttons): a
        third of its height, or flung, and it closes; otherwise it springs back.
      </li>
      <li>
        With a list: on the grouped background, the list’s groups on the
        elevated one.
      </li>
      <li>
        Its detent is the app’s: dragging doesn’t switch medium and large
        (UIKit’s does); the page behind doesn’t shrink back.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetOverviewDemos = [LiveView];
