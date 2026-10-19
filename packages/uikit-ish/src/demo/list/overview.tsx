import { FunctionComponent, useState } from 'react';

import { forwardClick, List, Switch, Symbol } from '../../components/index.js';
import { GuideLink } from '../hig-guide/link.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { KeyPropsTable, pickRows } from '../utils/props-table.js';
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
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsOverviewRoot,
    'List.Root',
    externalRoot,
    true,
  );
  const [chosen, setChosen] = useState<string>(settings[0].title);

  return (
    <Component
      inline
      stretch
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateContent, stateRoot])}
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
                    onCheckedChange={(checked: boolean) =>
                      addLog(`${title}: ${String(checked)}`)
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

/** `/list`: what a list is for, and its key props. */
export const ListOverview: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      A list shows rows of data in sections (UIKit <code>UITableView</code>):
      each section a group of rows, with an optional header and footer. Rows are
      grids of parts: an edit control, an image, a title and subtitle, and
      trailing parts (a detail, a chevron, a checkmark, a control). Rows can be
      pressed, swiped for actions, reordered and selected.
    </p>
    <LiveView />

    <h2>When to use it</h2>
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

    <h2>When to use something else</h2>
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
        Text between rows, without rows: a <code>List.Block</code> in a section
        (see <a href="list/parts">Parts</a>).
      </li>
    </ul>

    <h2>Key props</h2>
    <p>
      The props most lists set, across their parts; every part’s props are on{' '}
      <a href="list/parts">Parts</a>.
    </p>
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

    <h2>Accessibility</h2>
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
        Chevrons (<code>List.DrillIn</code>, <code>List.Disclosure</code>) are
        hidden from assistive technology, and so is a{' '}
        <code>List.Checkmark</code>: the chosen row of a list of options isn’t
        conveyed by it.
      </li>
      <li>
        Edit controls: <code>List.Checkbox</code> and <code>List.Radio</code>{' '}
        have the <code>checkbox</code> and <code>radio</code> roles,{' '}
        <code>List.EditButton</code> is a button; name each by its row (
        <code>aria-label</code>). A <code>List.Grabber</code> is focusable
        (without a role), named by its <code>aria-label</code>; arrow keys move
        its row.
      </li>
      <li>
        Swipe actions are buttons in the tab order, named by their{' '}
        <code>label</code>; focusing one opens its row’s actions. A closed{' '}
        <code>List.Expandable</code> is inert.
      </li>
      <li>
        <code>List.Index</code> is a <code>nav</code> (name it), its letters
        buttons.
      </li>
      <li>
        A collapsible section’s header, as Base UI’s{' '}
        <code>Collapsible.Trigger</code>, is a button with{' '}
        <code>aria-expanded</code>. In Chrome, its name leaves out the{' '}
        <code>List.Title</code> in it (the title is <code>draggable</code>{' '}
        <code>false</code>, which Chrome skips when naming an element by its
        content); give the header an <code>aria-label</code>.
      </li>
      <li>
        Its animations (swiping, reordering, expanding) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <h2>Behavior</h2>
    <ul>
      <li>
        A row is pressable when its <code>Title</code> (or a{' '}
        <code>List.Button</code>) is a button or link: its hit area covers the
        row, beneath the trailing controls; pressed, the row shows UIKit’s
        selection gray. A row with a control passes its clicks on to it (
        <code>forwardClick</code>).
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
        Dragging a row’s <code>Grabber</code> reorders it in its group (
        <code>onReorder</code>; the app reorders its rows). Plain lists’ section
        titles stick to the top while their section scrolls.
      </li>
      <li>
        Edit controls (<code>Checkbox</code>, <code>Radio</code>,{' '}
        <code>EditButton</code>) lead the row, grabbers end it; entering and
        leaving edit mode (<code>editing</code>), they slide in and out from the
        row’s edges (300ms). A delete button opens the row’s trailing swipe
        actions (guide <GuideLink to="rule-g7">G7</GuideLink>: the list owns the
        selection).
      </li>
    </ul>
  </>
);
