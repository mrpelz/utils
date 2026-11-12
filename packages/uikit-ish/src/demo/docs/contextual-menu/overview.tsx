import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ContextualMenu,
  Symbol,
  useSizeClass,
  useTextActionsPrevention,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfPhoto, sfSquareAndArrowUp, sfTrash } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { propOptionsOverviewRoot } from '../menu/props.js';
import { partPropMaps } from '../part-options.js';
import {
  contextualMenuPositionerRows,
  contextualMenuPreviewRows,
  contextualMenuRootRows,
  contextualMenuTriggerRows,
} from './docs.js';

/** A photo's thumbnail: held, it lifts into a preview, its menu below. */
const LiveView: FunctionComponent = () => {
  const id = 'contextual-menu-overview';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverviewRoot, {
    external,
    isOpen: true,
    title: 'ContextualMenu.Root',
  });
  // Opened by a held press: selecting no text (no browser text menu).
  const trigger = useLabelledRef<HTMLButtonElement>(
    'trigger',
    'HTMLButtonElement',
  );
  useTextActionsPrevention(trigger);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': ['size'],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup="useTextActionsPrevention(trigger);"
      stage="phone"
      state={[state, partState]}
      title="Contextual menu"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root
          {...partProps['ContextualMenu.Root']}
          size={props.size ?? sizeClass}
        >
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal {...partProps['ContextualMenu.Portal']}>
            <ContextualMenu.Backdrop
              {...partProps['ContextualMenu.Backdrop']}
            />
            <ContextualMenu.Positioner
              {...partProps['ContextualMenu.Positioner']}
            >
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Share clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Share
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Delete
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
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

/** `/contextual-menu`: what a contextual menu is for, and its props. */
export const ContextualMenuOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Actions on a piece of content, summoned from the content itself. The
        content lifts above the blurred page (or turns into a preview of
        itself), with a <a href={publicUrl('menu')}>Menu</a> below it.
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
        For actions on an item of content (a photo, a message, a file), as
        shortcuts to what its own screen offers.
      </li>
      <li>
        For a larger preview of the item while choosing, as in a photos or mail
        app.
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
        Actions behind a control (a “More” button): use a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
      </li>
      <li>
        Actions on selected text: use an{' '}
        <a href={publicUrl('edit-menu')}>Edit Menu</a>.
      </li>
      <li>
        The only way to an action: put it in view as well, because people only
        find a contextual menu by trying.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most contextual menus set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('contextual-menu/parts')}>Parts</a> page. The items’
        props are a <a href={publicUrl('menu/parts')}>Menu</a>’s.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['ContextualMenu.Root', pickRows(contextualMenuRootRows, 'size')],
        [
          'ContextualMenu.Trigger',
          pickRows(contextualMenuTriggerRows, 'openOn', 'render'),
        ],
        [
          'ContextualMenu.Preview',
          pickRows(contextualMenuPreviewRows, 'children'),
        ],
        [
          'ContextualMenu.Positioner',
          pickRows(contextualMenuPositionerRows, 'align'),
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
        It works like a <a href={publicUrl('menu')}>Menu</a>: the trigger is a
        button that opens a <code>menu</code>, its items are menu items, and the
        keys are a menu’s.
      </li>
      <li>
        The preview is shown but never focused. Name what it shows (
        <code>role=&quot;img&quot;</code>, <code>aria-label</code>).
      </li>
      <li>
        Its lift and scale-in don’t follow <code>prefers-reduced-motion</code>.
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
        A right click or a held press opens it (drag on to an item, and lift to
        choose it), while a press stays the trigger’s own. With{' '}
        <code>openOn=&quot;click&quot;</code>, a press opens it too (on touch,
        at touch down).
      </li>
      <li>
        The trigger (or{' '}
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        ) and the menu are one popup, starting from the trigger’s place. They
        shift as far as they need to fit on the screen (as menus grow). On
        closing, the trigger settles back.
      </li>
      <li>
        When they’re too tall for the screen together, the menu scrolls. The
        preview takes at most the room the menu leaves (or half of it).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const contextualMenuOverviewDemos = [LiveView];
