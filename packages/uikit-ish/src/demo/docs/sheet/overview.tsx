import { FunctionComponent, useMemo } from 'react';

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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['onClick', 'prominent'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controlContent, controlRoot, controlPopup, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage={isTablet ? 'tablet' : 'phone'}
      state={[stateContent, stateRoot, statePopup, partState]}
      title="Sheet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          key={keyRoot}
          {...propsRoot}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact={isGlobal ? undefined : !isTablet}
            // (Global: the page's body, not the device's screen.)
            container={isGlobal ? document.body : undefined}
            {...propsPopup}
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              {content.grabber ? (
                <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              ) : null}
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                        onClick={() => addLog('Done clicked')}
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.slice(0, 5).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
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
        A focused task above the page, built on Base UI’s <code>Drawer</code>.
        On a phone, it comes from the bottom, large or medium. On a tablet, it’s
        a form sheet in the center, or a card at the leading edge.
      </li>
      <li>
        It’s modal, with the page dimmed behind it. Its buttons, a press outside
        it, Escape or a swipe down dismiss it.
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
        For a task of its own that keeps its parent in view, such as composing a
        message, adding a contact or editing details (with Cancel and Done).
      </li>
      <li>
        For a few options or details about the page, such as a share sheet or
        filters. A medium sheet is as tall as its content.
      </li>
      <li>
        For a task with several steps, with a{' '}
        <a href={publicUrl('navigation')}>Navigation</a> inside it (see{' '}
        <a href={publicUrl('sheet/composition')}>Composition</a>).
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
        A choice between a few actions: use an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>. A question that
        must be answered: use an <a href={publicUrl('alert')}>Alert</a>.
      </li>
      <li>
        Something tied to a control, on a tablet: use a{' '}
        <a href={publicUrl('popover')}>Popover</a> or a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
      </li>
      <li>
        Going deeper into the app’s content: push a page in a{' '}
        <a href={publicUrl('navigation')}>Navigation</a> instead.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most sheets set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('sheet/parts')}>Parts</a> page.
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
        A <code>dialog</code> (modal, with <code>aria-modal</code>), named by
        its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Title"
        />{' '}
        and described by its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Description"
        />
        .
      </li>
      <li>
        When it opens, focus moves into it and stays trapped there while it’s
        open. By touch, focus goes to the sheet itself, so the keyboard doesn’t
        open. When it closes, focus goes back to its trigger.
      </li>
      <li>
        When a field inside it is typed into, the keyboard lifts it, like the
        bars it pushes up (a floating sheet sits 8px above the keyboard). It’s
        lifted as far as the room above allows, keeping at least 64px below the
        screen’s top. A snapping sheet’s stops get no taller, and it goes back
        to its stop as the keyboard hides. A form sheet stays centered above the
        keyboard. Its content’s field is scrolled into view (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ).
      </li>
      <li>
        Escape closes it. Give it a button that closes it too (a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Close"
        />
        ), because swiping is a pointer gesture only.
      </li>
      <li>The page behind it is inert, and doesn’t scroll while it’s open.</li>
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
        Large: the whole screen except 10px at the top, opaque, with 38px top
        corners. Medium: a glass panel 8px from the sides and the bottom (the
        home indicator sits over its bottom margin), with 42px corners, as tall
        as its content. In dark mode, its glass has an edge like a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>’s: a light rim with a glow
        outside.
      </li>
      <li>
        When it isn’t compact (on windows from 768px, or with{' '}
        <code>compact={'{false}'}</code>), it’s a form sheet in the center, up
        to 936px by 852px. With <code>regular=&quot;card&quot;</code>, it’s a
        card from the bottom at the leading edge, 375px wide, which keeps its
        detent, swiping and snapping.
      </li>
      <li>
        It slides up as it opens, and the page behind it dims (by 20%, or 48% in
        dark mode).
      </li>
      <li>
        It can be dragged down by its header: the grabber, or the bar outside
        its buttons. Dragged a third of its height, or flung, it closes.
        Otherwise, it springs back.
      </li>
      <li>
        For grouped lists, use <code>background=&quot;grouped&quot;</code>. It
        then sits on the grouped background, with the lists’ groups on the
        elevated one, as on a page. The sheet doesn’t look inside for lists.
      </li>
      <li>
        The app owns its detent: swiping doesn’t switch between medium and
        large, and the page behind doesn’t shrink back.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetOverviewDemos = [LiveView];
