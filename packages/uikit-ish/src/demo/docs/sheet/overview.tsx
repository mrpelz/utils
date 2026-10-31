import { FunctionComponent } from 'react';

import {
  Button,
  List,
  Sheet,
  Toolbar,
  useSizeClass,
  Viewport,
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
import { names } from '../viewport/content.js';
import { sheetPopupRows, sheetRootRows } from './docs.js';
import {
  propOptionsOverviewContent,
  propOptionsOverviewPopup,
  propOptionsOverviewRoot,
} from './props.js';

/**
 * A phone's screen (or a tablet's): a button presenting a sheet, its
 * header's Cancel and Done, its list.
 */
const LiveView: FunctionComponent = () => {
  const id = 'sheet-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalPopup] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, title: 'Sheet.Root' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsOverviewPopup,
    { external: externalPopup, title: 'Sheet.Popup' },
  );
  const sizeClass = useSizeClass();
  // (Unset, by the window's size class; or a phone's, or a tablet's.)
  const isTablet =
    content.layout === undefined
      ? sizeClass === 'regular'
      : content.layout === 'tablet';
  const isGlobal = content.portal === 'global';

  return (
    <Component
      isExpanded
      isInline
      controls={[controlContent, controlRoot, controlPopup]}
      id={id}
      log={log}
      screen="centered"
      stage={isTablet ? 'tablet' : 'phone'}
      state={[stateContent, stateRoot, statePopup]}
      title="Sheet"
    >
      <Viewport.Content>
        <Sheet.Root
          key={keyRoot}
          {...propsRoot}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
            compact={isGlobal ? undefined : !isTablet}
            // (Global: the page's body, not the device's screen.)
            container={isGlobal ? document.body : undefined}
            {...propsPopup}
          >
            <Sheet.Header>
              {content.grabber ? <Sheet.Grabber /> : null}
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
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
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
        A focused task over the page (Base UI’s <code>Drawer</code>): from the
        bottom on a phone, large or medium; a form sheet, centered, on a tablet.
      </li>
      <li>
        Modal, the page dimmed behind it; dismissed by its buttons, a press
        outside it, Escape, or swiped down.
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
        [
          'Sheet.Popup',
          pickRows(sheetPopupRows, 'detent', 'compact', 'background'),
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
        A <code>dialog</code> (modal: <code>aria-modal</code>), named by its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Title"
        />
        , described by its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Description"
        />
        .
      </li>
      <li>
        Opened, focus moves into it (by touch: to the sheet itself, not opening
        the keyboard), trapped while it’s open; closed, back to its trigger.
      </li>
      <li>
        Escape closes it; give it a button that does too (a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Close"
        />
        ): swiping it is a pointer gesture only.
      </li>
      <li>The page behind it is inert and doesn’t scroll while it’s open.</li>
      <li>
        Its slide and fade (500ms) don’t follow{' '}
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
        With grouped lists, <code>background=&quot;grouped&quot;</code>: on the
        grouped background, the lists’ groups on the elevated one (as a page’s;
        the sheet doesn’t look inside for lists).
      </li>
      <li>
        Its detent is the app’s: swiping doesn’t switch medium and large; the
        page behind doesn’t shrink back.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetOverviewDemos = [LiveView];
