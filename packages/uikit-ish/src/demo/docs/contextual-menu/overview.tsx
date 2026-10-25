import '../sheet/style.css';
import './style.css';

import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent } from 'react';

import {
  Button,
  ContextualMenu,
  Symbol,
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
import { propOptionsOverviewRoot } from '../menu/props.js';
import {
  contextualMenuPositionerRows,
  contextualMenuPreviewRows,
  contextualMenuRootRows,
  contextualMenuTriggerRows,
} from './docs.js';

/** A photo's thumbnail: pressed, it lifts into a preview, its menu below. */
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

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Contextual menu"
    >
      <Viewport.Content>
        <ContextualMenu.Root size={props.size ?? sizeClass}>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
                <ContextualMenu.Item
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <ContextualMenu.Icon>
                    <Symbol icon={sfTrash} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Delete</ContextualMenu.Label>
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
        Actions on a piece of content, summoned from it: the content lifts above
        the blurred page (or turns into a preview of itself), a{' '}
        <a href="menu">Menu</a> below it (UIKit{' '}
        <code>UIContextMenuInteraction</code>).
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
        Actions on an item of content (a photo, a message, a file): shortcuts to
        what its own screen offers.
      </li>
      <li>A preview of the item, larger, while choosing (Photos, Mail).</li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Actions behind a control (a “More” button): a <a href="menu">Menu</a>.
      </li>
      <li>
        Actions on selected text: an <a href="edit-menu">Edit menu</a>.
      </li>
      <li>
        The only way to an action: put it in view too (a contextual menu is
        found by trying).
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
        All parts’ props: <a href="contextual-menu/parts">Parts</a>; the items’:
        a <a href="menu/parts">Menu</a>’s.
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
        A <a href="menu">Menu</a>’s: the trigger a button opening a{' '}
        <code>menu</code>, its items menu items, keys as a menu’s.
      </li>
      <li>
        The preview is shown, never focused: name what it shows (
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
        A press opens it (on touch, at touch down: drag on to an item, lift to
        choose it), or, with <code>openOn=&quot;secondaryClick&quot;</code>, a
        held press or a right click.
      </li>
      <li>
        The trigger (or{' '}
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        ) lifts as far as the menu needs to fit below it; closing, it settles
        back.
      </li>
      <li>
        Too tall for the viewport together, the preview and the menu scroll
        together, opened with the menu in view.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const contextualMenuOverviewDemos = [LiveView];
