import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  Sheet,
  Symbol,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfDocumentOnDocument,
  sfEyeglasses,
  sfHeart,
  sfXmark,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { photo } from '../avatar/props.js';
import { partPropMaps } from '../part-options.js';
import {
  activityViewActionRows,
  activityViewPeopleRows,
  activityViewPersonRows,
} from './docs.js';

/** A Share button: what's shared, people and actions, in a sheet. */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Count': [],
            'ActivityView.Header': [],
            'ActivityView.Heading': [],
            'ActivityView.Label': [],
            'ActivityView.Name': [],
            'ActivityView.People': ['aria-label'],
            'ActivityView.Person': ['onClick'],
            'ActivityView.Separator': [],
            'ActivityView.Subtitle': [],
            'ActivityView.Symbol': [],
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['aria-label', 'shape', 'size', 'variant'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Trigger': ['render'],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('activity-view-overview') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="activity-view-overview"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Activity view"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root {...partProps['Sheet.Root']}>
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
            <Button.Label {...partProps['Button.Label']}>Share</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            detent="medium"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <ActivityView.Header {...partProps['ActivityView.Header']}>
                <ActivityView.Thumbnail
                  {...partProps['ActivityView.Thumbnail']}
                >
                  <img
                    alt=""
                    src={photo(30)}
                  />
                </ActivityView.Thumbnail>
                <ActivityView.Heading {...partProps['ActivityView.Heading']}>
                  <ActivityView.Title {...partProps['ActivityView.Title']}>
                    Weekend Photos
                  </ActivityView.Title>
                  <ActivityView.Subtitle
                    {...partProps['ActivityView.Subtitle']}
                  >
                    12 Photos
                  </ActivityView.Subtitle>
                </ActivityView.Heading>
                <Sheet.Close
                  {...partProps['Sheet.Close']}
                  render={
                    <Button.Root
                      {...partProps['Button.Root']}
                      aria-label="Close"
                      shape="circle"
                      variant="glass"
                    />
                  }
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfXmark}
                    />
                  </Button.Icon>
                </Sheet.Close>
              </ActivityView.Header>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <ActivityView.Separator
                {...partProps['ActivityView.Separator']}
              />
              <ActivityView.People
                {...partProps['ActivityView.People']}
                aria-label="People"
              >
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Kate Brown')}
                >
                  <Avatar.Root {...partProps['Avatar.Root']}>
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      KB
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Kate Brown
                  </ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Gary and Fatima')}
                >
                  <Avatar.Group {...partProps['Avatar.Group']}>
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        GF
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        GF
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </Avatar.Group>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Gary and Fatima
                  </ActivityView.Name>
                  <ActivityView.Count {...partProps['ActivityView.Count']}>
                    2 People
                  </ActivityView.Count>
                </ActivityView.Person>
              </ActivityView.People>
              <ActivityView.Separator
                {...partProps['ActivityView.Separator']}
              />
              <ActivityView.Actions
                {...partProps['ActivityView.Actions']}
                aria-label="Actions"
              >
                <ActivityView.Action
                  {...partProps['ActivityView.Action']}
                  onClick={() => addLog('action: Copy')}
                >
                  <ActivityView.Symbol {...partProps['ActivityView.Symbol']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfDocumentOnDocument}
                    />
                  </ActivityView.Symbol>
                  <ActivityView.Label {...partProps['ActivityView.Label']}>
                    Copy
                  </ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  {...partProps['ActivityView.Action']}
                  onClick={() => addLog('action: Add to Favorites')}
                >
                  <ActivityView.Symbol {...partProps['ActivityView.Symbol']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfHeart}
                    />
                  </ActivityView.Symbol>
                  <ActivityView.Label {...partProps['ActivityView.Label']}>
                    Add to Favorites
                  </ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  {...partProps['ActivityView.Action']}
                  onClick={() => addLog('action: Add to Reading List')}
                >
                  <ActivityView.Symbol {...partProps['ActivityView.Symbol']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEyeglasses}
                    />
                  </ActivityView.Symbol>
                  <ActivityView.Label {...partProps['ActivityView.Label']}>
                    Add to Reading List
                  </ActivityView.Label>
                </ActivityView.Action>
              </ActivityView.Actions>
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

/** `/activity-view`: what an activity view is for, and its props. */
export const ActivityViewOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        For sharing something: what’s shared, people to share it with, and
        actions on it (a share sheet).
      </li>
      <li>
        Its parts go in the app’s <a href={publicUrl('sheet')}>Sheet</a>{' '}
        (compact) or <a href={publicUrl('popover')}>Popover</a> (regular).
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
        Behind a Share button: for sending, copying or saving what someone is
        looking at, with the people they often share with.
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
        A few actions on something, without sharing: use a{' '}
        <a href={publicUrl('menu')}>Menu</a> or a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a>.
      </li>
      <li>
        Choices about an action just started: use an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most activity views set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('activity-view/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['ActivityView.People', pickRows(activityViewPeopleRows, 'aria-label')],
        ['ActivityView.Person', pickRows(activityViewPersonRows, 'onClick')],
        ['ActivityView.Action', pickRows(activityViewActionRows, 'onClick')],
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
        People and actions are lists (name them with <code>aria-label</code>),
        and each item is a button named by its text.
      </li>
      <li>
        The actions’ symbols are hidden. A thumbnail is decorative (empty{' '}
        <code>alt</code>), since the title names what’s shared.
      </li>
      <li>The sheet or popover is the dialog. Name it after the title.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        Its header goes in the sheet’s or popover’s header (
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />
        ,{' '}
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        ). It stays put, while the rest scrolls under it, behind its edge
        effect.
      </li>
      <li>
        People and actions sit in rows that scroll sideways, 78px each and 14px
        apart. A row that fits is centered.
      </li>
      <li>
        A group’s name with its count (
        <PartLink
          component="activity-view"
          part="ActivityView.Count"
        />
        ) takes one line, and truncates.
      </li>
      <li>
        An action’s circle darkens while pressed. Pressing it does the action,
        and the app closes the sheet once it’s done.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const activityViewOverviewDemos = [LiveView];
