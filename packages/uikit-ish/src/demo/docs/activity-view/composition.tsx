import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  Header,
  List,
  Page,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfBook,
  sfDocumentOnDocument,
  sfHeart,
  sfPrinter,
  sfSquareAndArrowUp,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { photo } from '../avatar/props.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const moreActionsAsAListCode = `const copy = () => {…};

<Sheet.Popup
  compact
  background="grouped"
  detent="large"
>
  <Sheet.Header>
    <Sheet.Grabber />
    <ActivityView.Header>
      <ActivityView.Heading>
        <ActivityView.Title>Weekend Photos</ActivityView.Title>
        <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
      </ActivityView.Heading>
    </ActivityView.Header>
  </Sheet.Header>
  <Sheet.Content>
    <Viewport.Padding edge="block-start" />
    <ActivityView.Separator />
    <ActivityView.Actions aria-label="Actions">
      <ActivityView.Action onClick={copy}>
        <ActivityView.Symbol>
          <Symbol icon={sfDocumentOnDocument} />
        </ActivityView.Symbol>
        <ActivityView.Label>Copy</ActivityView.Label>
      </ActivityView.Action>
      …
    </ActivityView.Actions>
    {/* More actions: a list, symbols as the rows' images. */}
    <List.Root>
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Leading>
              <List.Image variant="symbol">
                <Symbol icon={sfBook} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title render={<button type="button" />}>
                Add Bookmark
              </List.Title>
            </List.Content>
          </List.Item>
          …
        </List.Group>
      </List.Section>
    </List.Root>
    <Viewport.Padding edge="block-end" />
  </Sheet.Content>
</Sheet.Popup>`;

const inAPopoverCode = `const photo = '/photos/weekend.jpg';
const share = () => {…};

<Popover.Root>
  <Popover.Trigger
    aria-label="Share"
    render={<Toolbar.Button shape="circle" />}
  >
    <Button.Icon>
      <Symbol icon={sfSquareAndArrowUp} />
    </Button.Icon>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup>
        <Popover.Arrow />
        <Popover.Header>
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
            </ActivityView.Heading>
          </ActivityView.Header>
        </Popover.Header>
        <Popover.Body>
          <Viewport.Padding edge="block-start" />
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={share}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator />
          <ActivityView.Actions aria-label="Actions">…</ActivityView.Actions>
        </Popover.Body>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** The share sheet's actions row, then more actions as a list. */
const MoreActionsAsAList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Header': [],
            'ActivityView.Heading': [],
            'ActivityView.Label': [],
            'ActivityView.Separator': [],
            'ActivityView.Subtitle': [],
            'ActivityView.Symbol': [],
            'ActivityView.Title': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Trigger': ['render'],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('activity-view-composition-list') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="activity-view-composition-list"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Activity view with more actions as a list"
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
            background="grouped"
            detent="large"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <ActivityView.Header {...partProps['ActivityView.Header']}>
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
              </ActivityView.Actions>
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfBook}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add Bookmark')}
                        >
                          Add Bookmark
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfPrinter}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Print')}
                        >
                          Print
                        </List.Title>
                      </List.Content>
                    </List.Item>
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

/** In a regular width: in a popover at the Share button. */
const InAPopover: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
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
            'Avatar.Root': [],
            'Button.Icon': [],
            'Page.Root': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': [],
            'Popover.Trigger': ['aria-label', 'render'],
            'Toolbar.Button': ['shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('activity-view-composition-popover') },
  );

  return (
    <Component
      isExpanded
      isInline
      baseUiId="popover"
      controls={[partControls]}
      id="activity-view-composition-popover"
      log={log}
      screen="centered"
      stage="tablet"
      state={[partState]}
      title="Activity view in a popover"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Weekend Photos</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Popover.Root {...partProps['Popover.Root']}>
                  <Popover.Trigger
                    {...partProps['Popover.Trigger']}
                    aria-label="Share"
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        shape="circle"
                      />
                    }
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Button.Icon>
                  </Popover.Trigger>
                  <Popover.Portal {...partProps['Popover.Portal']}>
                    <Popover.Positioner {...partProps['Popover.Positioner']}>
                      <Popover.Popup
                        {...partProps['Popover.Popup']}
                        className="activity-view-demo-popup"
                      >
                        <Popover.Arrow {...partProps['Popover.Arrow']} />
                        <Popover.Header {...partProps['Popover.Header']}>
                          <ActivityView.Header
                            {...partProps['ActivityView.Header']}
                          >
                            <ActivityView.Thumbnail
                              {...partProps['ActivityView.Thumbnail']}
                            >
                              <img
                                alt=""
                                src={photo(30)}
                              />
                            </ActivityView.Thumbnail>
                            <ActivityView.Heading
                              {...partProps['ActivityView.Heading']}
                            >
                              <ActivityView.Title
                                {...partProps['ActivityView.Title']}
                              >
                                Weekend Photos
                              </ActivityView.Title>
                              <ActivityView.Subtitle
                                {...partProps['ActivityView.Subtitle']}
                              >
                                12 Photos
                              </ActivityView.Subtitle>
                            </ActivityView.Heading>
                          </ActivityView.Header>
                        </Popover.Header>
                        <Popover.Body {...partProps['Popover.Body']}>
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
                                <Avatar.Fallback
                                  {...partProps['Avatar.Fallback']}
                                >
                                  KB
                                </Avatar.Fallback>
                              </Avatar.Root>
                              <ActivityView.Name
                                {...partProps['ActivityView.Name']}
                              >
                                Kate Brown
                              </ActivityView.Name>
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
                              <ActivityView.Symbol
                                {...partProps['ActivityView.Symbol']}
                              >
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={sfDocumentOnDocument}
                                />
                              </ActivityView.Symbol>
                              <ActivityView.Label
                                {...partProps['ActivityView.Label']}
                              >
                                Copy
                              </ActivityView.Label>
                            </ActivityView.Action>
                          </ActivityView.Actions>
                        </Popover.Body>
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['more-actions-as-a-list', 'More actions as a list'],
  ['in-a-popover', 'In a popover'],
];

/** `/activity-view/composition`: activity views in sheets and popovers. */
export const ActivityViewComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="more-actions-as-a-list"
      level={2}
    >
      More actions as a list
    </Heading>
    <ul>
      <li>
        On a compact width, it goes in a <a href={publicUrl('sheet')}>Sheet</a>{' '}
        (with <code>background=&quot;grouped&quot;</code>). Its header sits in
        the sheet’s{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />
        , below the grabber, and stays put. Below it, scrolling under it, come
        the actions row and more actions as a{' '}
        <a href={publicUrl('list')}>List</a> (with symbols as the rows’ images).
      </li>
      <li>
        There’s no thumbnail and there are no people, because the parts are
        optional (see{' '}
        <PartLink
          component="activity-view"
          part="ActivityView.Header"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the activity view’s header and actions row (
        <PartLink
          component="activity-view"
          part="ActivityView.Actions"
        />
        ), the{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        on its grouped background, and the{' '}
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        of rows with symbols as images.
      </li>
      <li>
        <strong>Demo:</strong> the actions and rows offered, and what choosing
        one does (logged).
      </li>
    </ul>
    <CodeView code={moreActionsAsAListCode} />
    <MoreActionsAsAList />

    <Heading
      id="in-a-popover"
      level={2}
    >
      In a popover
    </Heading>
    <ul>
      <li>
        On a regular width, it goes in a{' '}
        <a href={publicUrl('popover')}>Popover</a> at the Share button (in the
        page’s bar). Its header sits in the popover’s{' '}
        <PartLink
          component="popover"
          part="Popover.Header"
        />{' '}
        and stays put, while the rest scrolls under it, in its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />
        .
      </li>
      <li>
        It’s the same set of commands, shown as a sheet’s list (compact) or a
        popover’s (regular).
      </li>
      <li>
        <strong>Library:</strong> the activity view with its thumbnail and
        people (
        <PartLink
          component="activity-view"
          part="ActivityView.Thumbnail"
        />
        ,{' '}
        <PartLink
          component="activity-view"
          part="ActivityView.People"
        />
        ), the{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />{' '}
        at the bar’s Share button, and the page’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the shared item, the people suggested, the
        actions offered, and what each does (logged).
      </li>
    </ul>
    <CodeView code={inAPopoverCode} />
    <InAPopover />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const activityViewCompositionDemos = [MoreActionsAsAList, InAPopover];
