import { FunctionComponent, useMemo, useState } from 'react';

import {
  forwardClick,
  List,
  Switch,
  Symbol,
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['style', 'variant'],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Switch.Root': ['aria-label', 'onCheckedChange'],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, partState]}
      title="List"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Connections
            </List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {settings.map(({ color, detail, icon, subtitle, title }) => (
              <List.Item
                key={title}
                {...partProps['List.Item']}
                onClick={
                  content.trailing === 'switch'
                    ? forwardClick('[role=switch]')
                    : undefined
                }
              >
                <List.Leading {...partProps['List.Leading']}>
                  {content.image === 'none' ? null : (
                    <List.Image
                      {...partProps['List.Image']}
                      variant={content.image}
                      style={
                        content.image === 'symbol'
                          ? undefined
                          : { backgroundColor: color }
                      }
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={icon}
                      />
                    </List.Image>
                  )}
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  {content.trailing === 'drillIn' ||
                  content.trailing === 'checkmark' ? (
                    <List.Title
                      {...partProps['List.Title']}
                      render={<button type="button" />}
                      onClick={() => {
                        addLog(`${title} clicked`);
                        setChosen(title);
                      }}
                    >
                      {title}
                    </List.Title>
                  ) : (
                    <List.Title {...partProps['List.Title']}>
                      {title}
                    </List.Title>
                  )}
                  {content.subtitle ? (
                    <List.Subtitle {...partProps['List.Subtitle']}>
                      {subtitle}
                    </List.Subtitle>
                  ) : null}
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  {content.detail ? (
                    <List.Detail {...partProps['List.Detail']}>
                      {detail}
                    </List.Detail>
                  ) : null}
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  {content.trailing === 'drillIn' ? (
                    <List.DrillIn {...partProps['List.DrillIn']} />
                  ) : null}
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  {content.trailing === 'switch' ? (
                    <Switch.Root
                      {...partProps['Switch.Root']}
                      aria-label={title}
                      onCheckedChange={(isChecked: boolean) =>
                        addLog(`${title}: ${String(isChecked)}`)
                      }
                    >
                      <Switch.Thumb {...partProps['Switch.Thumb']} />
                    </Switch.Root>
                  ) : null}
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  {content.trailing === 'checkmark' && chosen === title ? (
                    <List.Checkmark {...partProps['List.Checkmark']} />
                  ) : null}
                </List.Trailing>
              </List.Item>
            ))}
          </List.Group>
          <List.Footer {...partProps['List.Footer']}>
            A footer, aligned with the rows’ text.
          </List.Footer>
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
      <li>Rows of data, in sections.</li>
      <li>
        A section holds a group of rows, with an optional header and footer.
      </li>
      <li>
        A row is a grid of parts: an edit control, an image, a title and
        subtitle, and trailing parts such as a detail, a chevron, a checkmark or
        a control.
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
        For settings and forms: rows that hold a switch, a detail or a control,
        or that drill into a page (inset grouped; see{' '}
        <a href={publicUrl('list/composition')}>Composition</a>).
      </li>
      <li>
        For a collection of items to browse and act on, such as messages,
        contacts or files (plain), with swipe actions, an index and editing.
      </li>
      <li>
        For an app’s sections in a sidebar (<code>listStyle</code>{' '}
        <code>sidebar</code>, in a <a href={publicUrl('sidebar')}>Sidebar</a>).
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
        A few options shown side by side: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control. One option out
        of many, collapsed: use a <a href={publicUrl('menu')}>Menu</a> (a pop-up
        button, which can sit in a row).
      </li>
      <li>
        An app’s top-level sections on a phone: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>.
      </li>
      <li>
        Text between rows, without rows: use a{' '}
        <PartLink
          component="list"
          part="List.Block"
        />{' '}
        in a section (see <a href={publicUrl('list/parts')}>Parts</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most lists set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('list/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['List.Root', pickRows(listRootRows, 'listStyle', 'editing')],
        ['List.Header', pickRows(listHeaderRows, 'prominence')],
        ['List.Group', pickRows(listGroupRows, 'reorderHandle')],
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
        A group is a <code>ul</code> (the <code>list</code> role) and its rows
        are <code>li</code>s (<code>listitem</code>). A section is a{' '}
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
        . So the checkmark doesn’t convey which row of a list of options is
        chosen.
      </li>
      <li>
        Of the edit controls,{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Radio"
        />{' '}
        have the <code>checkbox</code> and <code>radio</code> roles, and{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        is a button. Name each by its row (<code>aria-label</code>). A{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        can take focus (it has no role) and is named by its{' '}
        <code>aria-label</code>. The arrow keys move its row.
      </li>
      <li>
        Swipe actions are buttons in the tab order, named by their{' '}
        <code>label</code>. Focusing one opens its row’s actions. A closed{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />{' '}
        is inert.
      </li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        is a <code>nav</code> (give it a name), and its letters are buttons.
      </li>
      <li>
        A collapsible section’s header, as Base UI’s{' '}
        <code>Collapsible.Trigger</code>, is a button with{' '}
        <code>aria-expanded</code>. In Chrome, its name leaves out the{' '}
        <PartLink
          component="list"
          part="List.Title"
        />{' '}
        inside it: the title has <code>draggable</code> set to{' '}
        <code>false</code>, which Chrome skips when naming an element by its
        content. Give the header an <code>aria-label</code>.
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
        ) is a button or link. Its hit area then covers the row, beneath the
        trailing controls, and the row shows the selection gray when pressed. A
        row with a control passes its clicks on to that control (
        <code>forwardClick</code>).
      </li>
      <li>
        Rows are at least 52px tall (68px with a subtitle), and grow with
        wrapping text. Trailing parts sit 16px apart. Sections are 35px apart.
      </li>
      <li>
        Swiping a row reveals its actions. A quick swipe, or one past half of
        them, opens them, and a flick stops at them. With <code>overswipe</code>
        , dragging on past them triggers the outermost one. At rest, a row is
        always closed or open, never in between, and it doesn’t move toward a
        side without actions. Only one row is open at a time.
      </li>
      <li>
        Dragging a row’s{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        >
          Grabber
        </PartLink>{' '}
        moves it wherever its reorder handle allows (
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ), across groups too; the app reorders its rows. In plain lists, section
        titles stick to the top while their section scrolls.
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
        ) lead the row, and grabbers end it. Edit mode is set by{' '}
        <code>editing</code>, per side, on the list, a section, a group or a
        row, each overriding the one around it. Entering and leaving it, the
        controls slide in and out from the row’s edges (300ms), and regular
        parts make way where told to (<code>whileEditing</code>; a chevron by
        default). A delete button rendered by a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        >
          SwipeActionsTrigger
        </PartLink>{' '}
        opens the row’s trailing swipe actions (the list owns the selection).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const listOverviewDemos = [LiveView];
