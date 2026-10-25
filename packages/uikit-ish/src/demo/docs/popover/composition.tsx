import '../sheet/style.css';
import '../toolbar/style.css';
import './style.css';

import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfLine3HorizontalDecreaseCircle } from '@bradleyhodges/sfsymbols/sfLine3HorizontalDecreaseCircle';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent } from 'react';

import {
  Button,
  forwardClick,
  List,
  Popover,
  Sheet,
  Switch,
  Symbol,
  Toolbar,
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
import { names } from '../viewport/content.js';
import { propOptionsPresentation } from './props.js';

/** A network's row: its info button, its details in a popover at its end. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      id="popover-composition-list-row"
      log={log}
      title="Popover in a list row"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Title>Home Network</List.Title>
              <Popover.Root
                onOpenChange={(isOpen: boolean) =>
                  addLog(`details: ${String(isOpen)}`)
                }
              >
                <Popover.Trigger
                  aria-label="Details"
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
                <Popover.Portal>
                  <Popover.Positioner align="end">
                    <Popover.Popup className="popover-demo-popup">
                      <Popover.Arrow />
                      <Popover.Header>
                        <Toolbar.Root placement="block-start">
                          <Toolbar.Title>
                            <Popover.Title render={<span />}>
                              Home Network
                            </Popover.Title>
                          </Toolbar.Title>
                        </Toolbar.Root>
                      </Popover.Header>
                      <Popover.Body>
                        <List.Root>
                          <List.Section>
                            <List.Group>
                              <List.Item>
                                <List.Title>IP Address</List.Title>
                                <List.Detail>192.168.1.24</List.Detail>
                              </List.Item>
                              <List.Item>
                                <List.Title>Router</List.Title>
                                <List.Detail>192.168.1.1</List.Detail>
                              </List.Item>
                            </List.Group>
                          </List.Section>
                        </List.Root>
                      </Popover.Body>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

const adaptiveCode = `// A popover in a regular width (iPad), a sheet in a compact one (iPhone).
const sheet = useSizeClass() === 'compact';

sheet ? (
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root />}>…</Sheet.Trigger>
    <Sheet.Popup detent="medium">
      <Sheet.Header>
        <Sheet.Grabber />
        <Toolbar.Root placement="block-start">…</Toolbar.Root>
      </Sheet.Header>
      <Sheet.Content>{/* the same content */}</Sheet.Content>
    </Sheet.Popup>
  </Sheet.Root>
) : (
  <Popover.Root>
    <Popover.Trigger render={<Button.Root />}>…</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <Popover.Arrow />
          <Popover.Header>
            <Toolbar.Root placement="block-start">…</Toolbar.Root>
          </Popover.Header>
          <Popover.Body>{/* the same content */}</Popover.Body>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);`;

/**
 * Display options: in a popover (a regular width), or a sheet (a compact
 * one; or as set), the same content.
 */
const ASheetOnIPhone: FunctionComponent = () => {
  const id = 'popover-composition-sheet';
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
      title="Popover or sheet"
    >
      {isSheet ? (
        <Viewport.Content>
          <Sheet.Root
            onOpenChange={(isOpen: boolean) =>
              addLog(`sheet: ${String(isOpen)}`)
            }
          >
            <Sheet.Trigger
              render={
                <Button.Root
                  size="large"
                  variant="bordered"
                />
              }
            >
              <Button.Label>Display Options</Button.Label>
            </Sheet.Trigger>
            <Sheet.Popup
              compact
              detent="medium"
            >
              <Sheet.Header>
                <Sheet.Grabber />
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Sheet.Title render={<span />}>Display</Sheet.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Sheet.Close
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
                    </Sheet.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Sheet.Header>
              <Sheet.Content>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Sheet.Content>
            </Sheet.Popup>
          </Sheet.Root>
        </Viewport.Content>
      ) : (
        <Popover.Root
          onOpenChange={(isOpen: boolean) =>
            addLog(`popover: ${String(isOpen)}`)
          }
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
            <Popover.Positioner>
              <Popover.Popup className="popover-demo-popup">
                <Popover.Arrow />
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
                          <List.Title>Show Completed</List.Title>
                          <Switch.Root aria-label="Show completed">
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                        <List.Item onClick={forwardClick('[role=switch]')}>
                          <List.Title>Show Notes</List.Title>
                          <Switch.Root
                            defaultChecked
                            aria-label="Show notes"
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                      </List.Group>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};

/** A toolbar's filter button, its options in a popover below it. */
const FromAToolbarButton: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      id="popover-composition-toolbar"
      log={log}
      title="Popover from a toolbar button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root placement="block-start">
          <Toolbar.Title>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing>
            <Popover.Root>
              <Popover.Trigger
                aria-label="Filter"
                render={<Toolbar.Button shape="circle" />}
              >
                <Button.Icon>
                  <Symbol icon={sfLine3HorizontalDecreaseCircle} />
                </Button.Icon>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner>
                  <Popover.Popup className="popover-demo-popup">
                    <Popover.Arrow />
                    <Popover.Header>
                      <Toolbar.Root placement="block-start">
                        <Toolbar.Title>
                          <Popover.Title render={<span />}>
                            Filter
                          </Popover.Title>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Popover.Header>
                    <Popover.Body>
                      <List.Root>
                        <List.Section>
                          <List.Group>
                            <List.Item onClick={forwardClick('[role=switch]')}>
                              <List.Title>Unread</List.Title>
                              <Switch.Root
                                aria-label="Unread"
                                onCheckedChange={(isChecked: boolean) =>
                                  addLog(`unread: ${String(isChecked)}`)
                                }
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </List.Item>
                            <List.Item onClick={forwardClick('[role=switch]')}>
                              <List.Title>Flagged</List.Title>
                              <Switch.Root
                                aria-label="Flagged"
                                onCheckedChange={(isChecked: boolean) =>
                                  addLog(`flagged: ${String(isChecked)}`)
                                }
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </List.Item>
                          </List.Group>
                        </List.Section>
                      </List.Root>
                    </Popover.Body>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** A long list in its body: the bar stays, the list scrolls. */
const ScrollingContent: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      id="popover-composition-scrolling"
      log={log}
      title="Popover with scrolling content"
    >
      <Popover.Root>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Share With</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup
              className="popover-demo-popup"
              style={{ maxHeight: 360 }}
            >
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Share With</Popover.Title>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.map((name) => (
                        <List.Item key={name}>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => addLog(`share with ${name}`)}
                          >
                            {name}
                          </List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
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
  ['in-a-list-row', 'In a list row'],
  ['a-sheet-on-iphone', 'A sheet on iPhone'],
  ['from-a-toolbar-button', 'From a toolbar button'],
  ['content-that-scrolls', 'Content that scrolls'],
];

/** `/popover/composition`: popovers with other components. */
export const PopoverComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        A row’s info button (a <a href="button">Button</a>, its symbol) shows
        details of the row’s item.
      </li>
      <li>
        Aligned with the row’s end, as iOS’s (
        <PartLink
          component="popover"
          part="Popover.Positioner"
        />
        ’s <code>align=&quot;end&quot;</code>; centered by default).
      </li>
    </ul>
    <InAListRow />

    <Heading
      id="a-sheet-on-iphone"
      level={2}
    >
      A sheet on iPhone
    </Heading>
    <ul>
      <li>
        In a compact width, iOS shows a popover’s content as a sheet (guide{' '}
        <a href="hig-guide#rule-a5">A5</a>): the app’s choice here, by{' '}
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ; a <a href="sheet">Sheet</a> with the same bar and content (its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        >
          Header
        </PartLink>
        ,{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        >
          Content
        </PartLink>
        ).
      </li>
      <li>Resize the window, or choose the presentation.</li>
    </ul>
    <CodeView code={adaptiveCode} />
    <ASheetOnIPhone />

    <Heading
      id="from-a-toolbar-button"
      level={2}
    >
      From a toolbar button
    </Heading>
    <ul>
      <li>
        A <a href="toolbar">Toolbar</a>’s button (
        <code>{'render={<Toolbar.Button />}'}</code>) shows options about the
        page: below it, its arrow pointing at it.
      </li>
      <li>
        For commands, or one choice among several, a <a href="menu">Menu</a>{' '}
        instead.
      </li>
    </ul>
    <FromAToolbarButton />

    <Heading
      id="content-that-scrolls"
      level={2}
    >
      Content that scrolls
    </Heading>
    <ul>
      <li>
        Its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolls when the popup reaches its maximum height: the room for it, or
        less (here: 360px, the app’s); its bar stays.
      </li>
    </ul>
    <ScrollingContent />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const popoverCompositionDemos = [
  InAListRow,
  ASheetOnIPhone,
  FromAToolbarButton,
  ScrollingContent,
];
