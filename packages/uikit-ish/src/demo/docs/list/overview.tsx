import { FunctionComponent, useState } from 'react';

import {
  forwardClick,
  List,
  Switch,
  Symbol,
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
import { GuideLink } from '../hig-guide/link.js';
import { settings } from './content.js';
import {
  listGroupRows,
  listHeaderRows,
  listImageRows,
  listItemRows,
  listRootRows,
  listSwipeActionsRows,
  listTitleRows,
} from './docs.js';
import {
  propOptionsOverviewContent,
  propOptionsOverviewRoot,
} from './props.js';

/** Settings rows, in a list style, with some of their parts. */
const LiveView: FunctionComponent = () => {
  const id = 'list-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, title: 'List.Root' },
  );
  const [chosen, setChosen] = useState<string>(settings[0].title);

  return (
    <Component
      isInline
      isStretched
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      state={[stateContent, stateRoot]}
      title="List"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title render={<h3 />}>Connections</List.Title>
          </List.Header>
          <List.Group>
            {settings.map(({ color, detail, icon, subtitle, title }) => (
              <List.Item
                key={title}
                onClick={
                  content.trailing === 'switch'
                    ? forwardClick('[role=switch]')
                    : undefined
                }
              >
                {content.image === 'none' ? null : (
                  <List.Image
                    variant={content.image}
                    style={
                      content.image === 'symbol'
                        ? undefined
                        : { backgroundColor: color }
                    }
                  >
                    <Symbol icon={icon} />
                  </List.Image>
                )}
                {content.trailing === 'drillIn' ||
                content.trailing === 'checkmark' ? (
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => {
                      addLog(`${title} clicked`);
                      setChosen(title);
                    }}
                  >
                    {title}
                  </List.Title>
                ) : (
                  <List.Title>{title}</List.Title>
                )}
                {content.subtitle ? (
                  <List.Subtitle>{subtitle}</List.Subtitle>
                ) : null}
                {content.detail ? <List.Detail>{detail}</List.Detail> : null}
                {content.trailing === 'drillIn' ? <List.DrillIn /> : null}
                {content.trailing === 'switch' ? (
                  <Switch.Root
                    aria-label={title}
                    onCheckedChange={(isChecked: boolean) =>
                      addLog(`${title}: ${String(isChecked)}`)
                    }
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                ) : null}
                {content.trailing === 'checkmark' && chosen === title ? (
                  <List.Checkmark />
                ) : null}
              </List.Item>
            ))}
          </List.Group>
          <List.Footer>A footer, aligned with the rows’ text.</List.Footer>
        </List.Section>
      </List.Root>
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

/** `/list`: what a list is for, and its key props. */
export const ListOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Rows of data in sections (UIKit <code>UITableView</code>).
      </li>
      <li>A section: a group of rows, an optional header and footer.</li>
      <li>
        A row: a grid of parts (an edit control, an image, a title and subtitle,
        trailing parts: a detail, a chevron, a checkmark, a control).
      </li>
      <li>Rows can be pressed, swiped for actions, reordered and selected.</li>
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
        Settings and forms: rows holding a switch, a detail, a control, or
        drilling into a page (inset grouped; see{' '}
        <a href="list/composition">Composition</a>).
      </li>
      <li>
        A collection of items to browse and act on: messages, contacts, files
        (plain), with swipe actions, an index, editing.
      </li>
      <li>
        An app’s sections in a sidebar (<code>listStyle</code>{' '}
        <code>sidebar</code>, in a <a href="sidebar">Sidebar</a>).
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
        A few options shown side by side: a <a href="segmented">Segmented</a>{' '}
        control; an option out of many, collapsed: a <a href="menu">Menu</a> (a
        pop-up button, which can sit in a row).
      </li>
      <li>
        An app’s top-level sections on iPhone: a <a href="tab-bar">Tab bar</a>.
      </li>
      <li>
        Text between rows, without rows: a{' '}
        <PartLink
          component="list"
          part="List.Block"
        />{' '}
        in a section (see <a href="list/parts">Parts</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most lists set, across their parts.</li>
      <li>
        All parts’ props: <a href="list/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['List.Root', pickRows(listRootRows, 'listStyle', 'editing')],
        ['List.Header', pickRows(listHeaderRows, 'prominence')],
        ['List.Group', pickRows(listGroupRows, 'onReorder')],
        ['List.Item', pickRows(listItemRows, 'onClick', 'selected')],
        ['List.Title', pickRows(listTitleRows, 'render')],
        ['List.Image', pickRows(listImageRows, 'variant')],
        [
          'List.SwipeActions',
          pickRows(listSwipeActionsRows, 'side', 'overswipe'),
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
        A group is a <code>ul</code> (the <code>list</code> role), its rows{' '}
        <code>li</code>s (<code>listitem</code>); a section is a{' '}
        <code>section</code>. Render a header’s title as a heading (
        <code>{'render={<h3 />}'}</code>).
      </li>
      <li>
        A pressable row’s title is its button, named by its text. A{' '}
        <code>selected</code> row has <code>aria-current</code>.
      </li>
      <li>
        Chevrons (
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        ) are hidden from assistive technology, and so is a{' '}
        <PartLink
          component="list"
          part="List.Checkmark"
        />
        : the chosen row of a list of options isn’t conveyed by it.
      </li>
      <li>
        Edit controls:{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Radio"
        />{' '}
        have the <code>checkbox</code> and <code>radio</code> roles,{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        is a button; name each by its row (<code>aria-label</code>). A{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        is focusable (without a role), named by its <code>aria-label</code>;
        arrow keys move its row.
      </li>
      <li>
        Swipe actions are buttons in the tab order, named by their{' '}
        <code>label</code>; focusing one opens its row’s actions. A closed{' '}
        <PartLink
          component="list"
          part="List.Expandable"
        />{' '}
        is inert.
      </li>
      <li>
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        is a <code>nav</code> (name it), its letters buttons.
      </li>
      <li>
        A collapsible section’s header, as Base UI’s{' '}
        <code>Collapsible.Trigger</code>, is a button with{' '}
        <code>aria-expanded</code>. In Chrome, its name leaves out the{' '}
        <PartLink
          component="list"
          part="List.Title"
        />{' '}
        in it (the title is <code>draggable</code> <code>false</code>, which
        Chrome skips when naming an element by its content); give the header an{' '}
        <code>aria-label</code>.
      </li>
      <li>
        Its animations (swiping, reordering, expanding) don’t follow{' '}
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
        A row is pressable when its{' '}
        <PartLink
          component="list"
          part="List.Title"
        >
          Title
        </PartLink>{' '}
        (or a{' '}
        <PartLink
          component="list"
          part="List.Button"
        />
        ) is a button or link: its hit area covers the row, beneath the trailing
        controls; pressed, the row shows UIKit’s selection gray. A row with a
        control passes its clicks on to it (<code>forwardClick</code>).
      </li>
      <li>
        Rows are at least 52px high, 68px with a subtitle, growing with wrapping
        text; trailing parts sit 16px apart. Sections are 35px apart.
      </li>
      <li>
        Swiping a row reveals its actions (a quick swipe, or past half of them,
        opens them); with <code>overswipe</code>, swiping on past them triggers
        the outermost one. One row is open at a time.
      </li>
      <li>
        Dragging a row’s{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        >
          Grabber
        </PartLink>{' '}
        reorders it in its group (<code>onReorder</code>; the app reorders its
        rows). Plain lists’ section titles stick to the top while their section
        scrolls.
      </li>
      <li>
        Edit controls (
        <PartLink
          component="list"
          part="List.Checkbox"
        >
          Checkbox
        </PartLink>
        ,{' '}
        <PartLink
          component="list"
          part="List.Radio"
        >
          Radio
        </PartLink>
        ,{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        >
          EditButton
        </PartLink>
        ) lead the row, grabbers end it; entering and leaving edit mode (
        <code>editing</code>), they slide in and out from the row’s edges
        (300ms). A delete button opens the row’s trailing swipe actions (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>: the list owns the selection).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const listOverviewDemos = [LiveView];
