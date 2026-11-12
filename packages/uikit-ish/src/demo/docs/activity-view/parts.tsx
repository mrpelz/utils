import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ActivityView,
  Avatar,
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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfDocumentOnDocument, sfHeart } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { photo } from '../avatar/props.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Count': [],
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...props}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Thumbnail"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...props}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Heading"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...props}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Title"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...props}>Weekend Photos</ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
            'ActivityView.Symbol': [],
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Subtitle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...props}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Message"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...props}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Separator (others)': [],
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
            'ActivityView.Subtitle': [],
            'ActivityView.Symbol': [],
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Separator"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...props} />
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
            {...partProps['ActivityView.Separator (others)']}
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
            'ActivityView.Person': ['onClick'],
            'ActivityView.Separator': [],
            'ActivityView.Subtitle': [],
            'ActivityView.Symbol': [],
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.People"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
          <ActivityView.People {...props}>
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Person (others)': ['onClick'],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Count': [],
            'ActivityView.Header': [],
            'ActivityView.Heading': [],
            'ActivityView.Label': [],
            'ActivityView.Message': [],
            'ActivityView.Name': [],
            'ActivityView.People': ['aria-label'],
            'ActivityView.Separator': [],
            'ActivityView.Subtitle': [],
            'ActivityView.Symbol': [],
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Person"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
          <ActivityView.People
            {...partProps['ActivityView.People']}
            aria-label="People"
          >
            <ActivityView.Person {...props}>
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
              {...partProps['ActivityView.Person (others)']}
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Name (others)': [],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Count': [],
            'ActivityView.Header': [],
            'ActivityView.Heading': [],
            'ActivityView.Label': [],
            'ActivityView.Message': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Name"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
              <ActivityView.Name {...props}>Kate Brown</ActivityView.Name>
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
              <ActivityView.Name {...partProps['ActivityView.Name (others)']}>
                Gary and Fatima
              </ActivityView.Name>
              <ActivityView.Count {...partProps['ActivityView.Count']}>
                2 People
              </ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Count"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
              <ActivityView.Count {...props}>2 People</ActivityView.Count>
            </ActivityView.Person>
          </ActivityView.People>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action': ['onClick'],
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Actions"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
          <ActivityView.Actions {...props}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Action (others)': ['onClick'],
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Action"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
          <ActivityView.Actions
            {...partProps['ActivityView.Actions']}
            aria-label="Actions"
          >
            <ActivityView.Action {...props}>
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
              {...partProps['ActivityView.Action (others)']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Symbol (others)': [],
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
            'ActivityView.Thumbnail': [],
            'ActivityView.Title': [],
            'Avatar.Fallback': [],
            'Avatar.Group': [],
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Symbol"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
          <ActivityView.Actions
            {...partProps['ActivityView.Actions']}
            aria-label="Actions"
          >
            <ActivityView.Action
              {...partProps['ActivityView.Action']}
              onClick={() => addLog('action: Copy')}
            >
              <ActivityView.Symbol {...props}>
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
              <ActivityView.Symbol
                {...partProps['ActivityView.Symbol (others)']}
              >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ActivityView.Label (others)': [],
            'ActivityView.Action': ['onClick'],
            'ActivityView.Actions': ['aria-label'],
            'ActivityView.Count': [],
            'ActivityView.Header': [],
            'ActivityView.Heading': [],
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
            'Avatar.Root': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActivityView.Label"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="activity-view-demo-panel">
          <ActivityView.Header {...partProps['ActivityView.Header']}>
            <ActivityView.Thumbnail {...partProps['ActivityView.Thumbnail']}>
              <img
                alt=""
                src={photo(30)}
              />
            </ActivityView.Thumbnail>
            <ActivityView.Heading {...partProps['ActivityView.Heading']}>
              <ActivityView.Title {...partProps['ActivityView.Title']}>
                Weekend Photos
              </ActivityView.Title>
              <ActivityView.Subtitle {...partProps['ActivityView.Subtitle']}>
                12 Photos
              </ActivityView.Subtitle>
              <ActivityView.Message {...partProps['ActivityView.Message']}>
                Only invited people can edit.
              </ActivityView.Message>
            </ActivityView.Heading>
          </ActivityView.Header>
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
          <ActivityView.Separator {...partProps['ActivityView.Separator']} />
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
              <ActivityView.Label {...props}>Copy</ActivityView.Label>
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
              <ActivityView.Label {...partProps['ActivityView.Label (others)']}>
                Add to Favorites
              </ActivityView.Label>
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
        Parts placed in the app’s <a href={publicUrl('sheet')}>Sheet</a>{' '}
        (compact) or <a href={publicUrl('popover')}>Popover</a> (regular). It
        has no root of its own.
      </li>
      <li>
        What’s shared (a header), people and actions (rows that scroll
        sideways), and separators between them. More actions can follow as a{' '}
        <a href={publicUrl('list')}>List</a>.
      </li>
      <li>
        Apps (a row of app icons, app badges on people) aren’t built. Use a{' '}
        <a href={publicUrl('badge')}>Badge</a> on an avatar instead.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        <span>or</span>{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />
        <ul>
          <li className="demo-tree-context">
            <PartLink
              component="sheet"
              part="Sheet.Header"
            />{' '}
            <span>or</span>{' '}
            <PartLink
              component="popover"
              part="Popover.Header"
            />
            <ul>
              <li>
                <PartLink
                  component="activity-view"
                  part="ActivityView.Header"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="activity-view"
                      part="ActivityView.Thumbnail"
                    />{' '}
                    (optional)
                  </li>
                  <li>
                    <PartLink
                      component="activity-view"
                      part="ActivityView.Heading"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Title"
                        />
                      </li>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Subtitle"
                        />{' '}
                        (optional)
                      </li>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Message"
                        />{' '}
                        (optional)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="demo-tree-context">
            <PartLink
              component="sheet"
              part="Sheet.Content"
            />{' '}
            <span>or</span>{' '}
            <PartLink
              component="popover"
              part="Popover.Body"
            />
            <ul>
              <li>
                <PartLink
                  component="activity-view"
                  part="ActivityView.Separator"
                />{' '}
                (between its sections){' '}
              </li>
              <li>
                <PartLink
                  component="activity-view"
                  part="ActivityView.People"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="activity-view"
                      part="ActivityView.Person"
                    />
                    <ul>
                      <li className="demo-tree-context">
                        <PartLink
                          component="avatar"
                          part="Avatar.Root"
                        />
                      </li>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Name"
                        />
                      </li>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Count"
                        />{' '}
                        (optional: a group’s)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="activity-view"
                  part="ActivityView.Actions"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="activity-view"
                      part="ActivityView.Action"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Symbol"
                        />
                      </li>
                      <li>
                        <PartLink
                          component="activity-view"
                          part="ActivityView.Label"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="list"
                  part="List.Root"
                />{' '}
                <span>(optional: more actions)</span>
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
        What’s shared, at the top (16px in, with its parts 16px apart): a
        thumbnail, a heading, and for example a close button.
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
        A picture of what’s shared: 64px, with 16px corners and a hairline
        border.
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
        The title and subtitle (1px apart), then, 12px below, for example a menu
        and a message.
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
      <li>The name of what’s shared: 15px, medium.</li>
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
      <li>A note about sharing: 13px, in the secondary label color.</li>
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
        A hairline between its sections, 16px in. Renders an <code>hr</code>.
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
        People to share with, in a row that scrolls sideways (24px from its
        start, 14px apart).
      </li>
      <li>
        Renders a <code>div</code> with the <code>list</code> role. Name it with{' '}
        <code>aria-label</code>.
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
        A person (or a group): an <a href={publicUrl('avatar')}>Avatar</a> above
        its <PartLink part="ActivityView.Name" />, 78px wide.
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
        The person’s name: 12px, on two lines. With a{' '}
        <PartLink part="ActivityView.Count" />, it takes one line, and
        truncates.
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
        How many people a group has, below its name, in the secondary label
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
      <li>Actions, in a row that scrolls sideways.</li>
      <li>
        Renders a <code>div</code> with the <code>list</code> role. Name it with{' '}
        <code>aria-label</code>.
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
        The action’s symbol, in a light weight, in a 70px circle on a fill
        (darker while pressed).
      </li>
      <li>
        It’s hidden from assistive technology, because the label names the
        action.
      </li>
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
      <li>The action’s name: 13px, on two lines.</li>
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
