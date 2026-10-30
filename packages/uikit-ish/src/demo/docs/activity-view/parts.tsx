import '../sheet/style.css';
import './style.css';

import { sfDocumentOnDocument } from '@bradleyhodges/sfsymbols/sfDocumentOnDocument';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { FunctionComponent, useMemo } from 'react';

import {
  ActivityView,
  Avatar,
  Symbol,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { photo } from '../avatar/props.js';
import {
  activityViewActionRows,
  activityViewActionsRows,
  activityViewCountRows,
  activityViewHeaderRows,
  activityViewHeadingRows,
  activityViewLabelRows,
  activityViewMessageRows,
  activityViewNameRows,
  activityViewPeopleRows,
  activityViewPersonRows,
  activityViewSeparatorRows,
  activityViewSubtitleRows,
  activityViewSymbolRows,
  activityViewThumbnailRows,
  activityViewTitleRows,
} from './docs.js';
import {
  getPropOptionsButton,
  propOptionsElement,
  propOptionsRow,
} from './props.js';

/** `ActivityView.Header`, outlined, with its props. */
const HeaderPart: FunctionComponent = () => {
  const id = 'activity-view-parts-header';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Header',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Header"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...props}>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Thumbnail`, outlined, with its props. */
const ThumbnailPart: FunctionComponent = () => {
  const id = 'activity-view-parts-thumbnail';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Thumbnail',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Thumbnail"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail {...props}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Heading`, outlined, with its props. */
const HeadingPart: FunctionComponent = () => {
  const id = 'activity-view-parts-heading';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Heading',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Heading"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...props}>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Title`, outlined, with its props. */
const TitlePart: FunctionComponent = () => {
  const id = 'activity-view-parts-title';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Title',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Title"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title {...props}>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Subtitle`, outlined, with its props. */
const SubtitlePart: FunctionComponent = () => {
  const id = 'activity-view-parts-subtitle';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Subtitle',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Subtitle"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle {...props}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Message`, outlined, with its props. */
const MessagePart: FunctionComponent = () => {
  const id = 'activity-view-parts-message';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Message',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Message"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message {...props}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Separator`, outlined, with its props. */
const SeparatorPart: FunctionComponent = () => {
  const id = 'activity-view-parts-separator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Separator',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Separator"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...props} />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.People`, outlined, with its props. */
const PeoplePart: FunctionComponent = () => {
  const id = 'activity-view-parts-people';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRow, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.People',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.People"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People {...props}>
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Person`, outlined, with its props. */
const PersonPart: FunctionComponent = () => {
  const id = 'activity-view-parts-person';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'ActivityView.Person',
    },
  );

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Person"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person {...props}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Name`, outlined, with its props. */
const NamePart: FunctionComponent = () => {
  const id = 'activity-view-parts-name';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Name',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Name"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name {...props}>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Count`, outlined, with its props. */
const CountPart: FunctionComponent = () => {
  const id = 'activity-view-parts-count';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Count',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Count"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count {...props}>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Actions`, outlined, with its props. */
const ActionsPart: FunctionComponent = () => {
  const id = 'activity-view-parts-actions';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRow, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Actions',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Actions"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator />
          <ActivityView.Actions {...props}>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Action`, outlined, with its props. */
const ActionPart: FunctionComponent = () => {
  const id = 'activity-view-parts-action';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'ActivityView.Action',
    },
  );

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Action"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator />
          <ActivityView.Actions aria-label="Actions">
            <ActivityView.Action {...props}>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Symbol`, outlined, with its props. */
const SymbolPart: FunctionComponent = () => {
  const id = 'activity-view-parts-symbol';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Symbol',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Symbol"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator />
          <ActivityView.Actions aria-label="Actions">
            <ActivityView.Action onClick={() => addLog('action: Copy')}>
              <ActivityView.Symbol {...props}>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `ActivityView.Label`, outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'activity-view-parts-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityView.Label',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActivityView.Label"
    >
      <Viewport.Content>
        <div className="activity-view-demo-panel">
          <ActivityView.Header>
            <ActivityView.Thumbnail>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading>
              <ActivityView.Title>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
              <ActivityView.Message>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator />
          <ActivityView.People aria-label="People">
            <ActivityView.Person onClick={() => addLog('person: Kate Brown')}>
              <Avatar.Root>
                <Avatar.Fallback>KB</Avatar.Fallback>
              </Avatar.Root>
              <ActivityView.Name>Kate Brown</ActivityView.Name>
            </ActivityView.Person>
            <ActivityView.Person
              onClick={() => addLog('person: Gary and Fatima')}
            >
              <Avatar.Group>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>GF</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
              <ActivityView.Name>Gary and Fatima</ActivityView.Name>
              <ActivityView.Count>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator />
          <ActivityView.Actions aria-label="Actions">
            <ActivityView.Action onClick={() => addLog('action: Copy')}>
              <ActivityView.Symbol>
                <Symbol icon={sfDocumentOnDocument} />
              </ActivityView.Symbol>
              <ActivityView.Label {...props}>Copy</ActivityView.Label>
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
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `/activity-view/parts`: what’s shared, people, actions. */
export const ActivityViewParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Parts placed in the app’s <a href="sheet">Sheet</a> (compact) or
        <a href="popover">Popover</a> (regular): no root of its own.
      </li>
      <li>
        What’s shared (a header), people and actions (rows scrolling sideways),
        separators between them; more actions as a <a href="list">List</a>
        below.
      </li>
      <li>
        Apps (an app icon row, people’s app badges) aren’t built: a
        <a href="badge">Badge</a> on an avatar instead.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="ActivityView.Header" /> (optional)
        <ul>
          <li>
            <PartLink part="ActivityView.Thumbnail" /> (optional)
          </li>
          <li>
            <PartLink part="ActivityView.Heading" />
            <ul>
              <li>
                <PartLink part="ActivityView.Title" />
              </li>
              <li>
                <PartLink part="ActivityView.Subtitle" /> (optional)
              </li>
              <li>
                <PartLink part="ActivityView.Message" /> (optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="ActivityView.Separator" />
      </li>
      <li>
        <PartLink part="ActivityView.People" /> (optional)
        <ul>
          <li>
            <PartLink part="ActivityView.Person" />
            <ul>
              <li>
                <PartLink part="ActivityView.Name" />
              </li>
              <li>
                <PartLink part="ActivityView.Count" /> (optional: a group’s)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="ActivityView.Actions" /> (optional)
        <ul>
          <li>
            <PartLink part="ActivityView.Action" />
            <ul>
              <li>
                <PartLink part="ActivityView.Symbol" />
              </li>
              <li>
                <PartLink part="ActivityView.Label" />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="activityview-header"
      level={2}
    >
      <code>ActivityView.Header</code>
    </Heading>
    <ul>
      <li>
        What’s shared, at the top (16px in, its parts 16px apart): a thumbnail,
        a heading, and e.g. a close button.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewHeaderRows} />

    <Heading
      id="activityview-thumbnail"
      level={2}
    >
      <code>ActivityView.Thumbnail</code>
    </Heading>
    <ul>
      <li>
        A picture of what’s shared: 64px, its corners 16px, a hairline border.
      </li>
    </ul>
    <ThumbnailPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewThumbnailRows} />

    <Heading
      id="activityview-heading"
      level={2}
    >
      <code>ActivityView.Heading</code>
    </Heading>
    <ul>
      <li>
        The title and subtitle (1px apart), then (12px below) e.g. a menu and a
        message.
      </li>
    </ul>
    <HeadingPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewHeadingRows} />

    <Heading
      id="activityview-title"
      level={2}
    >
      <code>ActivityView.Title</code>
    </Heading>
    <ul>
      <li>What’s shared, named: 15px, medium.</li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={activityViewTitleRows} />

    <Heading
      id="activityview-subtitle"
      level={2}
    >
      <code>ActivityView.Subtitle</code>
    </Heading>
    <ul>
      <li>More about it: 13px, in the secondary label color.</li>
    </ul>
    <SubtitlePart />
    <h3>Props</h3>
    <PropsTable rows={activityViewSubtitleRows} />

    <Heading
      id="activityview-message"
      level={2}
    >
      <code>ActivityView.Message</code>
    </Heading>
    <ul>
      <li>A note on sharing: 13px, in the secondary label color.</li>
    </ul>
    <MessagePart />
    <h3>Props</h3>
    <PropsTable rows={activityViewMessageRows} />

    <Heading
      id="activityview-separator"
      level={2}
    >
      <code>ActivityView.Separator</code>
    </Heading>
    <ul>
      <li>
        Between its sections: a hairline, 16px in. Renders an <code>hr</code>.
      </li>
    </ul>
    <SeparatorPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewSeparatorRows} />

    <Heading
      id="activityview-people"
      level={2}
    >
      <code>ActivityView.People</code>
    </Heading>
    <ul>
      <li>
        People to share with, in a row scrolling sideways (24px from its start,
        14px apart).
      </li>
      <li>
        Renders a <code>div</code> with the <code>list</code> role: name it (
        <code>aria-label</code>).
      </li>
    </ul>
    <PeoplePart />
    <h3>Props</h3>
    <PropsTable rows={activityViewPeopleRows} />

    <Heading
      id="activityview-person"
      level={2}
    >
      <code>ActivityView.Person</code>
    </Heading>
    <ul>
      <li>
        A person (or a group): an <a href="avatar">Avatar</a> above its{' '}
        <PartLink part="ActivityView.Name" />, 78px wide.
      </li>
      <li>
        Renders a <code>button</code> in a list item.
      </li>
    </ul>
    <PersonPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewPersonRows} />

    <Heading
      id="activityview-name"
      level={2}
    >
      <code>ActivityView.Name</code>
    </Heading>
    <ul>
      <li>
        The person’s name: 12px, two lines; with a{' '}
        <PartLink part="ActivityView.Count" />, one line, truncated.
      </li>
    </ul>
    <NamePart />
    <h3>Props</h3>
    <PropsTable rows={activityViewNameRows} />

    <Heading
      id="activityview-count"
      level={2}
    >
      <code>ActivityView.Count</code>
    </Heading>
    <ul>
      <li>
        How many people a group is, below its name, in the secondary label
        color.
      </li>
    </ul>
    <CountPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewCountRows} />

    <Heading
      id="activityview-actions"
      level={2}
    >
      <code>ActivityView.Actions</code>
    </Heading>
    <ul>
      <li>Actions, in a row scrolling sideways.</li>
      <li>
        Renders a <code>div</code> with the <code>list</code> role: name it (
        <code>aria-label</code>).
      </li>
    </ul>
    <ActionsPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewActionsRows} />

    <Heading
      id="activityview-action"
      level={2}
    >
      <code>ActivityView.Action</code>
    </Heading>
    <ul>
      <li>
        An action: its <PartLink part="ActivityView.Symbol" /> above its{' '}
        <PartLink part="ActivityView.Label" />, 78px wide.
      </li>
      <li>
        Renders a <code>button</code> in a list item.
      </li>
    </ul>
    <ActionPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewActionRows} />

    <Heading
      id="activityview-symbol"
      level={2}
    >
      <code>ActivityView.Symbol</code>
    </Heading>
    <ul>
      <li>
        The action’s symbol, light, in a 70px circle on a fill (darker while
        pressed).
      </li>
      <li>Hidden from assistive technology: the label names the action.</li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewSymbolRows} />

    <Heading
      id="activityview-label"
      level={2}
    >
      <code>ActivityView.Label</code>
    </Heading>
    <ul>
      <li>The action’s name: 13px, two lines.</li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={activityViewLabelRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const activityViewPartsDemos = [
  HeaderPart,
  ThumbnailPart,
  HeadingPart,
  TitlePart,
  SubtitlePart,
  MessagePart,
  SeparatorPart,
  PeoplePart,
  PersonPart,
  NamePart,
  CountPart,
  ActionsPart,
  ActionPart,
  SymbolPart,
  LabelPart,
];
