import '../sheet/style.css';
import './style.css';

import { FunctionComponent } from 'react';

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
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
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
import { photo } from '../avatar/props.js';
import { GuideLink } from '../hig-guide/link.js';

/** The share sheet's actions row, then more actions as a list. */
const MoreActionsAsAList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="activity-view-composition-list"
      log={log}
      screen="centered"
      stage="phone"
      title="Activity view with more actions as a list"
    >
      <Viewport.Content>
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Share</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            background="grouped"
            detent="large"
          >
            <Sheet.Header>
              <Sheet.Grabber />
            </Sheet.Header>
            <Sheet.Content>
              <ActivityView.Header>
                <ActivityView.Heading>
                  <ActivityView.Title>Weekend Photos</ActivityView.Title>
                  <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
                </ActivityView.Heading>
              </ActivityView.Header>
              <ActivityView.Separator />
              <ActivityView.Actions aria-label="Actions">
                <ActivityView.Action onClick={() => addLog('action: Copy')}>
                  <ActivityView.Symbol>
                    <Symbol icon={sfDocumentOnDocument} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Copy</ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  onClick={() => addLog('action: Add to Favorites')}
                >
                  <ActivityView.Symbol>
                    <Symbol icon={sfHeart} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Add to Favorites</ActivityView.Label>
                </ActivityView.Action>
              </ActivityView.Actions>
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
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add Bookmark')}
                        >
                          Add Bookmark
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPrinter} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
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
              <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isExpanded
      isInline
      baseUiId="popover"
      id="activity-view-composition-popover"
      log={log}
      screen="centered"
      stage="tablet"
      title="Activity view in a popover"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>Weekend Photos</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
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
                      <Popover.Popup className="activity-view-demo-popup">
                        <Popover.Arrow />
                        <Popover.Body>
                          <ActivityView.Header>
                            <ActivityView.Thumbnail>
                              <img
                                alt=""
                                src={photo(30)}
                              />
                            </ActivityView.Thumbnail>
                            <ActivityView.Heading>
                              <ActivityView.Title>
                                Weekend Photos
                              </ActivityView.Title>
                              <ActivityView.Subtitle>
                                12 Photos
                              </ActivityView.Subtitle>
                            </ActivityView.Heading>
                          </ActivityView.Header>
                          <ActivityView.Separator />
                          <ActivityView.People aria-label="People">
                            <ActivityView.Person
                              onClick={() => addLog('person: Kate Brown')}
                            >
                              <Avatar.Root>
                                <Avatar.Fallback>KB</Avatar.Fallback>
                              </Avatar.Root>
                              <ActivityView.Name>Kate Brown</ActivityView.Name>
                            </ActivityView.Person>
                          </ActivityView.People>
                          <ActivityView.Separator />
                          <ActivityView.Actions aria-label="Actions">
                            <ActivityView.Action
                              onClick={() => addLog('action: Copy')}
                            >
                              <ActivityView.Symbol>
                                <Symbol icon={sfDocumentOnDocument} />
                              </ActivityView.Symbol>
                              <ActivityView.Label>Copy</ActivityView.Label>
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
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <Viewport.Padding edge="block-end" />
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
        In a compact width, in a <a href="sheet">Sheet</a> (its{' '}
        <code>background=&quot;grouped&quot;</code>): the actions row, then more
        actions as a <a href="list">List</a> (symbols as the rows’ images).
      </li>
      <li>
        Without a thumbnail or people: the parts are optional (see{' '}
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
        at its grouped background, and the{' '}
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
    <MoreActionsAsAList />

    <Heading
      id="in-a-popover"
      level={2}
    >
      In a popover
    </Heading>
    <ul>
      <li>
        In a regular width, in a <a href="popover">Popover</a> at the Share
        button (in the page’s bar), in its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />
        .
      </li>
      <li>
        Guide <GuideLink to="primitive-command-set">§5</GuideLink>: the same
        Command set, rendered as a sheet list (compact) or a popover list
        (regular).
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
        actions offered and what each does (logged).
      </li>
    </ul>
    <InAPopover />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const activityViewCompositionDemos = [MoreActionsAsAList, InAPopover];
