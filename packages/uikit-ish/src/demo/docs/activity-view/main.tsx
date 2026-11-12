import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  List,
  Popover,
  Sheet,
  Symbol,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfBook,
  sfChevronRight,
  sfDocumentOnDocument,
  sfEyeglasses,
  sfHeart,
  sfPencilTipCropCircle,
  sfPerson2Fill,
  sfPlusSquare,
  sfPrinter,
  sfXmark,
} from '../../tooling/icons.js';
import { photo } from '../avatar/props.js';
import { partPropMaps } from '../part-options.js';
import { propOptionsContent } from './props.js';

/**
 * An activity view: what's shared, people to share with, actions; in a
 * sheet (compact).
 */
export const ActivityViewDemo: FunctionComponent = () => {
  const id = 'activity-view';

  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

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
            'ActivityView.Message': [],
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
            'Avatar.Image': ['src'],
            'Avatar.Root': [],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [
              'aria-label',
              'onClick',
              'shape',
              'size',
              'variant',
            ],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': ['defaultOpen'],
            'Sheet.Trigger': ['render'],
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
      controls={[controlContent, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateContent, partState]}
      title="Activity View"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen={content.defaultOpen}
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
            <Button.Label {...partProps['Button.Label']}>Share</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            detent="medium"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <ActivityView.Header {...partProps['ActivityView.Header']}>
                {content.thumbnail ? (
                  <ActivityView.Thumbnail
                    {...partProps['ActivityView.Thumbnail']}
                  >
                    <img
                      alt=""
                      src={photo(30)}
                    />
                  </ActivityView.Thumbnail>
                ) : null}
                <ActivityView.Heading {...partProps['ActivityView.Heading']}>
                  <ActivityView.Title {...partProps['ActivityView.Title']}>
                    Title
                  </ActivityView.Title>
                  <ActivityView.Subtitle
                    {...partProps['ActivityView.Subtitle']}
                  >
                    Subtitle
                  </ActivityView.Subtitle>
                  <Button.Root
                    {...partProps['Button.Root']}
                    size="small"
                    variant="bordered-secondary"
                    onClick={() => addLog('options')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfPerson2Fill}
                      />
                    </Button.Icon>
                    <Button.Label {...partProps['Button.Label']}>
                      Label
                    </Button.Label>
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfChevronRight}
                      />
                    </Button.Icon>
                  </Button.Root>
                  <ActivityView.Message {...partProps['ActivityView.Message']}>
                    Only invited people can edit.
                  </ActivityView.Message>
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
              <ActivityView.Separator
                {...partProps['ActivityView.Separator']}
              />
              <ActivityView.People
                {...partProps['ActivityView.People']}
                aria-label="People"
              >
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Ashley Kamin')}
                >
                  <Avatar.Root {...partProps['Avatar.Root']}>
                    <Avatar.Image
                      {...partProps['Avatar.Image']}
                      src={photo(20)}
                    />
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      AK
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Ashley Kamin
                  </ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Amber Spiers')}
                >
                  <Avatar.Root {...partProps['Avatar.Root']}>
                    <Avatar.Image
                      {...partProps['Avatar.Image']}
                      src={photo(200)}
                    />
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      AS
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Amber Spiers
                  </ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Gary and Fatima')}
                >
                  <Avatar.Group {...partProps['Avatar.Group']}>
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        src={photo(120)}
                      />
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        GF
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        src={photo(280)}
                      />
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
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Simon Pickford')}
                >
                  <Avatar.Root {...partProps['Avatar.Root']}>
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      SP
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Simon Pickford
                  </ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  {...partProps['ActivityView.Person']}
                  onClick={() => addLog('person: Lea Rossi')}
                >
                  <Avatar.Root {...partProps['Avatar.Root']}>
                    <Avatar.Image
                      {...partProps['Avatar.Image']}
                      src={photo(50)}
                    />
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      LR
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name {...partProps['ActivityView.Name']}>
                    Lea Rossi
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
                <ActivityView.Action
                  {...partProps['ActivityView.Action']}
                  onClick={() => addLog('action: Add Bookmark')}
                >
                  <ActivityView.Symbol {...partProps['ActivityView.Symbol']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfBook}
                    />
                  </ActivityView.Symbol>
                  <ActivityView.Label {...partProps['ActivityView.Label']}>
                    Add Bookmark
                  </ActivityView.Label>
                </ActivityView.Action>
              </ActivityView.Actions>
              {/* (On the glass: its groups on a fill, see List.) */}
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
                            icon={sfEyeglasses}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Reading List')}
                        >
                          Add to Reading List
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
                            icon={sfHeart}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Favorites')}
                        >
                          Add to Favorites
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
                            icon={sfPlusSquare}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Home Screen')}
                        >
                          Add to Home Screen
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
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
                            icon={sfPencilTipCropCircle}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('action: Markup')}
                        >
                          Markup
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
                  <List.Footer {...partProps['List.Footer']}>
                    <Button.Root
                      {...partProps['Button.Root']}
                      variant="glass"
                      onClick={() => addLog('edit actions')}
                    >
                      <Button.Label {...partProps['Button.Label']}>
                        Edit Actions
                      </Button.Label>
                    </Button.Root>
                  </List.Footer>
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

/** The activity view in a popover (regular). */
export const ActivityViewPopoverDemo: FunctionComponent = () => {
  const id = 'activity-view-popover';

  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

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
            'ActivityView.Message': [],
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
            'Avatar.Image': ['src'],
            'Avatar.Root': [],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [
              'aria-label',
              'onClick',
              'shape',
              'size',
              'variant',
            ],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': ['defaultOpen'],
            'Popover.Trigger': ['render'],
            'Viewport.Padding': ['anchor', 'edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      controls={[controlContent, partControls]}
      id={id}
      log={log}
      state={[stateContent, partState]}
      title="Activity View (Popover)"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen={content.defaultOpen}
      >
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>Share</Button.Label>
        </Popover.Trigger>
        <Popover.Portal {...partProps['Popover.Portal']}>
          <Popover.Positioner {...partProps['Popover.Positioner']}>
            <Popover.Popup
              {...partProps['Popover.Popup']}
              className="activity-view-demo-popup"
            >
              <Popover.Arrow {...partProps['Popover.Arrow']} />
              <Popover.Body {...partProps['Popover.Body']}>
                <ActivityView.Header {...partProps['ActivityView.Header']}>
                  {content.thumbnail ? (
                    <ActivityView.Thumbnail
                      {...partProps['ActivityView.Thumbnail']}
                    >
                      <img
                        alt=""
                        src={photo(30)}
                      />
                    </ActivityView.Thumbnail>
                  ) : null}
                  <ActivityView.Heading {...partProps['ActivityView.Heading']}>
                    <ActivityView.Title {...partProps['ActivityView.Title']}>
                      Title
                    </ActivityView.Title>
                    <ActivityView.Subtitle
                      {...partProps['ActivityView.Subtitle']}
                    >
                      Subtitle
                    </ActivityView.Subtitle>
                    <Button.Root
                      {...partProps['Button.Root']}
                      size="small"
                      variant="bordered-secondary"
                      onClick={() => addLog('options')}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfPerson2Fill}
                        />
                      </Button.Icon>
                      <Button.Label {...partProps['Button.Label']}>
                        Label
                      </Button.Label>
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfChevronRight}
                        />
                      </Button.Icon>
                    </Button.Root>
                    <ActivityView.Message
                      {...partProps['ActivityView.Message']}
                    >
                      Only invited people can edit.
                    </ActivityView.Message>
                  </ActivityView.Heading>
                  <Popover.Close
                    {...partProps['Popover.Close']}
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
                  </Popover.Close>
                </ActivityView.Header>
                <ActivityView.Separator
                  {...partProps['ActivityView.Separator']}
                />
                <ActivityView.People
                  {...partProps['ActivityView.People']}
                  aria-label="People"
                >
                  <ActivityView.Person
                    {...partProps['ActivityView.Person']}
                    onClick={() => addLog('person: Ashley Kamin')}
                  >
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        src={photo(20)}
                      />
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        AK
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name {...partProps['ActivityView.Name']}>
                      Ashley Kamin
                    </ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    {...partProps['ActivityView.Person']}
                    onClick={() => addLog('person: Amber Spiers')}
                  >
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        src={photo(200)}
                      />
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        AS
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name {...partProps['ActivityView.Name']}>
                      Amber Spiers
                    </ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    {...partProps['ActivityView.Person']}
                    onClick={() => addLog('person: Gary and Fatima')}
                  >
                    <Avatar.Group {...partProps['Avatar.Group']}>
                      <Avatar.Root {...partProps['Avatar.Root']}>
                        <Avatar.Image
                          {...partProps['Avatar.Image']}
                          src={photo(120)}
                        />
                        <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                          GF
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Avatar.Root {...partProps['Avatar.Root']}>
                        <Avatar.Image
                          {...partProps['Avatar.Image']}
                          src={photo(280)}
                        />
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
                  <ActivityView.Person
                    {...partProps['ActivityView.Person']}
                    onClick={() => addLog('person: Simon Pickford')}
                  >
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        SP
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name {...partProps['ActivityView.Name']}>
                      Simon Pickford
                    </ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    {...partProps['ActivityView.Person']}
                    onClick={() => addLog('person: Lea Rossi')}
                  >
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        src={photo(50)}
                      />
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        LR
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name {...partProps['ActivityView.Name']}>
                      Lea Rossi
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
                  <ActivityView.Action
                    {...partProps['ActivityView.Action']}
                    onClick={() => addLog('action: Add Bookmark')}
                  >
                    <ActivityView.Symbol {...partProps['ActivityView.Symbol']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfBook}
                      />
                    </ActivityView.Symbol>
                    <ActivityView.Label {...partProps['ActivityView.Label']}>
                      Add Bookmark
                    </ActivityView.Label>
                  </ActivityView.Action>
                </ActivityView.Actions>
                {/* (On the glass: its groups on a fill, see List.) */}
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
                              icon={sfEyeglasses}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() =>
                              addLog('action: Add to Reading List')
                            }
                          >
                            Add to Reading List
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
                              icon={sfHeart}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => addLog('action: Add to Favorites')}
                          >
                            Add to Favorites
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
                              icon={sfPlusSquare}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => addLog('action: Add to Home Screen')}
                          >
                            Add to Home Screen
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    </List.Group>
                  </List.Section>
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
                              icon={sfPencilTipCropCircle}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => addLog('action: Markup')}
                          >
                            Markup
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Button.Root
                        {...partProps['Button.Root']}
                        variant="glass"
                        onClick={() => addLog('edit actions')}
                      >
                        <Button.Label {...partProps['Button.Label']}>
                          Edit Actions
                        </Button.Label>
                      </Button.Root>
                    </List.Footer>
                  </List.Section>
                </List.Root>
                {/* (Its own gap: the screen's anchors aren't the popover's.) */}
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  anchor={null}
                  edge="block-end"
                />
              </Popover.Body>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};
