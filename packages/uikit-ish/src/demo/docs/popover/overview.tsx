import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  forwardClick,
  List,
  Popover,
  Switch,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfXmark } from '../../tooling/icons.js';
import { GuideLink } from '../hig-guide/link.js';
import {
  popoverPositionerRows,
  popoverRootRows,
  popoverTriggerRows,
} from './docs.js';
import {
  getPropOptionsOverviewRoot,
  propOptionsContent,
  propOptionsOverviewPositioner,
} from './props.js';

/** A button's popover: its bar (title, close), its settings, a note. */
const LiveView: FunctionComponent = () => {
  const id = 'popover-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalPositioner] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsOverviewRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Popover.Root' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsOverviewPositioner,
    { external: externalPositioner, title: 'Popover.Positioner' },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[controlContent, controlRoot, controlPositioner]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePositioner]}
      title="Popover"
    >
      <Popover.Root
        key={keyRoot}
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
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner {...propsPositioner}>
            <Popover.Popup className="popover-demo-popup">
              {content.arrow ? <Popover.Arrow /> : null}
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Content>
                          <List.Title>Show Completed</List.Title>
                        </List.Content>
                        <List.Trailing>
                          <Switch.Root
                            aria-label="Show completed"
                            onCheckedChange={(isChecked: boolean) =>
                              addLog(`show completed: ${String(isChecked)}`)
                            }
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Content>
                          <List.Title>Show Notes</List.Title>
                        </List.Content>
                        <List.Trailing>
                          <Switch.Root
                            defaultChecked
                            aria-label="Show notes"
                            onCheckedChange={(isChecked: boolean) =>
                              addLog(`show notes: ${String(isChecked)}`)
                            }
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
                  </List.Section>
                </List.Root>
              </Popover.Body>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
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

/** `/popover`: what a popover is for, and its props. */
export const PopoverOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A transient view above the page, at the control that shows it, its arrow
        pointing at it.
      </li>
      <li>
        In a regular width; in a compact one, the same content usually in a{' '}
        <a href="sheet">Sheet</a> (see{' '}
        <a href="popover/composition#a-sheet-in-a-compact-width">
          A sheet in a compact width
        </a>
        ).
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
        A small task or a few settings about what the control acts on (display
        options, a color, a date), done without leaving the page.
      </li>
      <li>
        Its content can be anything: a <a href="list">List</a>, a{' '}
        <a href="roll">Roll</a>, a <a href="date-picker">Date picker</a>’s
        calendar, a <a href="color-picker">Color picker</a>.
      </li>
      <li>
        A Container of the guide’s <em>Surface</em> family (
        <GuideLink to="primitive-surface">§5</GuideLink>): a popover is anchored
        to its control, dismissed by a press outside it.
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
        A list of commands or of choices: a <a href="menu">Menu</a> (menus, not
        popovers, for those).
      </li>
      <li>
        A focused task that must be finished or canceled (a new item, a form): a{' '}
        <a href="sheet">Sheet</a>.
      </li>
      <li>
        A decision the app needs now: an <a href="alert">Alert</a> or an{' '}
        <a href="action-sheet">Action sheet</a>.
      </li>
      <li>
        A short hint about a control: a <a href="tooltip">Tooltip</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most popovers set.</li>
      <li>
        All parts’ props: <a href="popover/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Popover.Root',
          pickRows(
            popoverRootRows,
            'open',
            'defaultOpen',
            'onOpenChange',
            'modal',
            'handle',
          ),
        ],
        ['Popover.Trigger', pickRows(popoverTriggerRows, 'render')],
        [
          'Popover.Positioner',
          pickRows(popoverPositionerRows, 'side', 'align'),
        ],
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
        The popup is a <code>dialog</code>, named by its{' '}
        <PartLink
          component="popover"
          part="Popover.Title"
        />{' '}
        and described by its{' '}
        <PartLink
          component="popover"
          part="Popover.Description"
        />
        ; without a title, name it (<code>aria-label</code>).
      </li>
      <li>
        The trigger has <code>aria-expanded</code> and{' '}
        <code>aria-haspopup</code>; opening moves focus into the popup (by
        touch, onto the popup, not opening the keyboard), closing back to the
        trigger.
      </li>
      <li>
        Escape closes it. With <code>modal</code>, focus is trapped in it: then
        render a{' '}
        <PartLink
          component="popover"
          part="Popover.Close"
        />{' '}
        in it, so touch screen readers can leave it.
      </li>
      <li>
        Its scale-in doesn’t follow <code>prefers-reduced-motion</code>.
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
        Below its trigger by default (<code>side</code>), centered on it (
        <code>align</code>; in a <a href="list">List</a> row, aligned with the
        row’s end: <code>align=&quot;end&quot;</code>); on the other side if
        there’s no room, 8px from the screen’s edges.
      </li>
      <li>
        Its arrow points at its trigger, on whichever side it ends up; the popup
        moves out by the arrow’s depth.
      </li>
      <li>
        Taller than the room for it, its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolls (its bar stays).
      </li>
      <li>
        A press outside closes it (not a modal one’s: there, outside presses are
        blocked, and close it too).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const popoverOverviewDemos = [LiveView];
