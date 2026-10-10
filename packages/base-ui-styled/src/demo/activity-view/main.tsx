import { sfBook } from '@bradleyhodges/sfsymbols/sfBook';
import { sfChevronRight } from '@bradleyhodges/sfsymbols/sfChevronRight';
import { sfDocumentOnDocument } from '@bradleyhodges/sfsymbols/sfDocumentOnDocument';
import { sfEyeglasses } from '@bradleyhodges/sfsymbols/sfEyeglasses';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfPencilTipCropCircle } from '@bradleyhodges/sfsymbols/sfPencilTipCropCircle';
import { sfPerson2Fill } from '@bradleyhodges/sfsymbols/sfPerson2Fill';
import { sfPlusSquare } from '@bradleyhodges/sfsymbols/sfPlusSquare';
import { sfPrinter } from '@bradleyhodges/sfsymbols/sfPrinter';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { CSSProperties, FunctionComponent, ReactNode } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  List,
  Popover,
  Sheet,
} from '../../components/index.js';
import { photo } from '../avatar/props.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import { propOptionsContent } from './props.js';

type Symbol = Parameters<typeof SFSymbol>[0]['icon'];

const people: {
  count?: string;
  hues: number[];
  initials: string;
  name: string;
}[] = [
  { hues: [20], initials: 'AK', name: 'Ashley Kamin' },
  { hues: [200], initials: 'AS', name: 'Amber Spiers' },
  {
    count: '2 People',
    hues: [120, 280],
    initials: 'GF',
    name: 'Gary and Fatima',
  },
  { hues: [], initials: 'SP', name: 'Simon Pickford' },
  { hues: [50], initials: 'LR', name: 'Lea Rossi' },
];

const actions: [string, Symbol][] = [
  ['Copy', sfDocumentOnDocument],
  ['Add to Favorites', sfHeart],
  ['Add to Reading List', sfEyeglasses],
  ['Add Bookmark', sfBook],
];

const listActions: [string, Symbol][][] = [
  [
    ['Add to Reading List', sfEyeglasses],
    ['Add Bookmark', sfBook],
    ['Add to Favorites', sfHeart],
    ['Add to Home Screen', sfPlusSquare],
  ],
  [
    ['Markup', sfPencilTipCropCircle],
    ['Print', sfPrinter],
  ],
];

/**
 * An activity view (UIKit `UIActivityViewController`, Figma “Activity
 * Views”): what's shared, people to share with, actions; in a sheet
 * (iPhone) or a popover (iPad).
 */
export const ActivityViewDemo: FunctionComponent = () => {
  const id = 'activity-view';

  const [log, addLog] = useLog();

  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const body = (close: ReactNode) => (
    <>
      <ActivityView.Header>
        {content.thumbnail ? (
          <ActivityView.Thumbnail>
            <img
              alt=""
              src={photo(30)}
            />
          </ActivityView.Thumbnail>
        ) : null}
        <ActivityView.Heading>
          <ActivityView.Title>Title</ActivityView.Title>
          <ActivityView.Subtitle>Subtitle</ActivityView.Subtitle>
          <Button.Root
            size="small"
            variant="bordered-secondary"
            onClick={() => addLog('options')}
          >
            <Button.Symbol>
              <SFSymbol icon={sfPerson2Fill} />
            </Button.Symbol>
            <Button.Label>Label</Button.Label>
            <Button.Symbol>
              <SFSymbol icon={sfChevronRight} />
            </Button.Symbol>
          </Button.Root>
          <ActivityView.Message>
            Only invited people can edit.
          </ActivityView.Message>
        </ActivityView.Heading>
        {close}
      </ActivityView.Header>
      <ActivityView.Separator />
      <ActivityView.People aria-label="People">
        {people.map(({ count, hues, initials, name }) => {
          const avatar = (hue: number | undefined, key?: number) => (
            <Avatar.Root key={key}>
              {hue === undefined ? null : <Avatar.Image src={photo(hue)} />}
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar.Root>
          );
          return (
            <ActivityView.Person
              key={name}
              count={count}
              name={name}
              onClick={() => addLog(`person: ${name}`)}
            >
              {hues.length > 1 ? (
                <Avatar.Group>
                  {hues.map((hue, index) => avatar(hue, index))}
                </Avatar.Group>
              ) : (
                avatar(hues[0])
              )}
            </ActivityView.Person>
          );
        })}
      </ActivityView.People>
      <ActivityView.Separator />
      <ActivityView.Actions aria-label="Actions">
        {actions.map(([label, symbol]) => (
          <ActivityView.Action
            key={label}
            label={label}
            onClick={() => addLog(`action: ${label}`)}
          >
            <SFSymbol icon={symbol} />
          </ActivityView.Action>
        ))}
      </ActivityView.Actions>
      {/* On the sheet: its groups on a fill (Figma). */}
      <List.Root
        style={
          {
            '--styled-list-background': 'transparent',
            '--styled-list-group-background':
              'var(--color-ios-tertiary-system-fill)',
          } as CSSProperties
        }
      >
        {listActions.map((group, index) => (
          <List.Section key={index}>
            <List.Group>
              {group.map(([label, symbol]) => (
                <List.Item key={label}>
                  <List.Image variant="symbol">
                    <SFSymbol icon={symbol} />
                  </List.Image>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => addLog(`action: ${label}`)}
                  >
                    {label}
                  </List.Title>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        ))}
      </List.Root>
      <div
        style={{ display: 'grid', justifyItems: 'center', paddingBlock: 16 }}
      >
        <Button.Root
          variant="glass"
          onClick={() => addLog('edit actions')}
        >
          <Button.Label>Edit Actions</Button.Label>
        </Button.Root>
      </div>
    </>
  );

  const closeButton = (
    <Button.Symbol>
      <SFSymbol icon={sfXmark} />
    </Button.Symbol>
  );
  const trigger = (
    <Button.Root
      size="large"
      variant="bordered"
    />
  );

  return (
    <Component
      center
      controls={[controlContent]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateContent])}
      title="Activity View"
    >
      {content.container === 'sheet' ? (
        <Sheet.Root defaultOpen={content.defaultOpen}>
          <Sheet.Trigger render={trigger}>
            <Button.Label>Share</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup>
            <Sheet.Header />
            <Sheet.Content>
              {body(
                <Sheet.Close
                  render={
                    <Button.Root
                      aria-label="Close"
                      shape="circle"
                      variant="glass"
                    />
                  }
                >
                  {closeButton}
                </Sheet.Close>,
              )}
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      ) : (
        <Popover.Root defaultOpen={content.defaultOpen}>
          <Popover.Trigger render={trigger}>
            <Button.Label>Share</Button.Label>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup style={{ maxHeight: 640, width: 402 }}>
                <Popover.Arrow />
                <Popover.Body>
                  {body(
                    <Popover.Close
                      render={
                        <Button.Root
                          aria-label="Close"
                          shape="circle"
                          variant="glass"
                        />
                      }
                    >
                      {closeButton}
                    </Popover.Close>,
                  )}
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};
