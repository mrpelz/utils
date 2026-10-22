import '../sheet/style.css';
import './style.css';

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
import { FunctionComponent } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  List,
  Popover,
  Sheet,
  Symbol,
} from '../../components/index.js';
import { photo } from '../avatar/props.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { propOptionsContent } from './props.js';

/**
 * An activity view (UIKit `UIActivityViewController`, Figma “Activity
 * Views”): what's shared, people to share with, actions; in a sheet
 * (iPhone).
 */
export const ActivityViewDemo: FunctionComponent = () => {
  const id = 'activity-view';

  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [externalContent] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      controls={controlContent}
      id={id}
      log={log}
      state={[stateContent]}
      title="Activity View"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root defaultOpen={content.defaultOpen}>
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
            container={screen}
            detent="medium"
          >
            <Sheet.Header>
              <Sheet.Grabber />
            </Sheet.Header>
            <Sheet.Content>
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
                    <Button.Icon>
                      <Symbol icon={sfPerson2Fill} />
                    </Button.Icon>
                    <Button.Label>Label</Button.Label>
                    <Button.Icon>
                      <Symbol icon={sfChevronRight} />
                    </Button.Icon>
                  </Button.Root>
                  <ActivityView.Message>
                    Only invited people can edit.
                  </ActivityView.Message>
                </ActivityView.Heading>
                <Sheet.Close
                  render={
                    <Button.Root
                      aria-label="Close"
                      shape="circle"
                      variant="glass"
                    />
                  }
                >
                  <Button.Icon>
                    <Symbol icon={sfXmark} />
                  </Button.Icon>
                </Sheet.Close>
              </ActivityView.Header>
              <ActivityView.Separator />
              <ActivityView.People aria-label="People">
                <ActivityView.Person
                  onClick={() => addLog('person: Ashley Kamin')}
                >
                  <Avatar.Root>
                    <Avatar.Image src={photo(20)} />
                    <Avatar.Fallback>AK</Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name>Ashley Kamin</ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  onClick={() => addLog('person: Amber Spiers')}
                >
                  <Avatar.Root>
                    <Avatar.Image src={photo(200)} />
                    <Avatar.Fallback>AS</Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name>Amber Spiers</ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  onClick={() => addLog('person: Gary and Fatima')}
                >
                  <Avatar.Group>
                    <Avatar.Root>
                      <Avatar.Image src={photo(120)} />
                      <Avatar.Fallback>GF</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root>
                      <Avatar.Image src={photo(280)} />
                      <Avatar.Fallback>GF</Avatar.Fallback>
                    </Avatar.Root>
                  </Avatar.Group>
                  <ActivityView.Name>Gary and Fatima</ActivityView.Name>
                  <ActivityView.Count>2 People</ActivityView.Count>
                </ActivityView.Person>
                <ActivityView.Person
                  onClick={() => addLog('person: Simon Pickford')}
                >
                  <Avatar.Root>
                    <Avatar.Fallback>SP</Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name>Simon Pickford</ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  onClick={() => addLog('person: Lea Rossi')}
                >
                  <Avatar.Root>
                    <Avatar.Image src={photo(50)} />
                    <Avatar.Fallback>LR</Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name>Lea Rossi</ActivityView.Name>
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
                <ActivityView.Action
                  onClick={() => addLog('action: Add to Reading List')}
                >
                  <ActivityView.Symbol>
                    <Symbol icon={sfEyeglasses} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Add to Reading List</ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  onClick={() => addLog('action: Add Bookmark')}
                >
                  <ActivityView.Symbol>
                    <Symbol icon={sfBook} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Add Bookmark</ActivityView.Label>
                </ActivityView.Action>
              </ActivityView.Actions>
              {/* (On the glass: its groups on a fill, see List.) */}
              <List.Root>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfEyeglasses} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Add to Reading List')}
                      >
                        Add to Reading List
                      </List.Title>
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfBook} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Add Bookmark')}
                      >
                        Add Bookmark
                      </List.Title>
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfHeart} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Add to Favorites')}
                      >
                        Add to Favorites
                      </List.Title>
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfPlusSquare} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Add to Home Screen')}
                      >
                        Add to Home Screen
                      </List.Title>
                    </List.Item>
                  </List.Group>
                </List.Section>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfPencilTipCropCircle} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Markup')}
                      >
                        Markup
                      </List.Title>
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfPrinter} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('action: Print')}
                      >
                        Print
                      </List.Title>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
              <div className="activity-view-demo-edit">
                <Button.Root
                  variant="glass"
                  onClick={() => addLog('edit actions')}
                >
                  <Button.Label>Edit Actions</Button.Label>
                </Button.Root>
              </div>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** The activity view in a popover (iPad). */
export const ActivityViewPopoverDemo: FunctionComponent = () => {
  const id = 'activity-view-popover';

  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      controls={controlContent}
      id={id}
      log={log}
      state={[stateContent]}
      title="Activity View (Popover)"
    >
      <Popover.Root defaultOpen={content.defaultOpen}>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Share</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="activity-view-demo-popup">
              <Popover.Arrow />
              <Popover.Body>
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
                      <Button.Icon>
                        <Symbol icon={sfPerson2Fill} />
                      </Button.Icon>
                      <Button.Label>Label</Button.Label>
                      <Button.Icon>
                        <Symbol icon={sfChevronRight} />
                      </Button.Icon>
                    </Button.Root>
                    <ActivityView.Message>
                      Only invited people can edit.
                    </ActivityView.Message>
                  </ActivityView.Heading>
                  <Popover.Close
                    render={
                      <Button.Root
                        aria-label="Close"
                        shape="circle"
                        variant="glass"
                      />
                    }
                  >
                    <Button.Icon>
                      <Symbol icon={sfXmark} />
                    </Button.Icon>
                  </Popover.Close>
                </ActivityView.Header>
                <ActivityView.Separator />
                <ActivityView.People aria-label="People">
                  <ActivityView.Person
                    onClick={() => addLog('person: Ashley Kamin')}
                  >
                    <Avatar.Root>
                      <Avatar.Image src={photo(20)} />
                      <Avatar.Fallback>AK</Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name>Ashley Kamin</ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    onClick={() => addLog('person: Amber Spiers')}
                  >
                    <Avatar.Root>
                      <Avatar.Image src={photo(200)} />
                      <Avatar.Fallback>AS</Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name>Amber Spiers</ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    onClick={() => addLog('person: Gary and Fatima')}
                  >
                    <Avatar.Group>
                      <Avatar.Root>
                        <Avatar.Image src={photo(120)} />
                        <Avatar.Fallback>GF</Avatar.Fallback>
                      </Avatar.Root>
                      <Avatar.Root>
                        <Avatar.Image src={photo(280)} />
                        <Avatar.Fallback>GF</Avatar.Fallback>
                      </Avatar.Root>
                    </Avatar.Group>
                    <ActivityView.Name>Gary and Fatima</ActivityView.Name>
                    <ActivityView.Count>2 People</ActivityView.Count>
                  </ActivityView.Person>
                  <ActivityView.Person
                    onClick={() => addLog('person: Simon Pickford')}
                  >
                    <Avatar.Root>
                      <Avatar.Fallback>SP</Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name>Simon Pickford</ActivityView.Name>
                  </ActivityView.Person>
                  <ActivityView.Person
                    onClick={() => addLog('person: Lea Rossi')}
                  >
                    <Avatar.Root>
                      <Avatar.Image src={photo(50)} />
                      <Avatar.Fallback>LR</Avatar.Fallback>
                    </Avatar.Root>
                    <ActivityView.Name>Lea Rossi</ActivityView.Name>
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
                  <ActivityView.Action
                    onClick={() => addLog('action: Add to Reading List')}
                  >
                    <ActivityView.Symbol>
                      <Symbol icon={sfEyeglasses} />
                    </ActivityView.Symbol>
                    <ActivityView.Label>Add to Reading List</ActivityView.Label>
                  </ActivityView.Action>
                  <ActivityView.Action
                    onClick={() => addLog('action: Add Bookmark')}
                  >
                    <ActivityView.Symbol>
                      <Symbol icon={sfBook} />
                    </ActivityView.Symbol>
                    <ActivityView.Label>Add Bookmark</ActivityView.Label>
                  </ActivityView.Action>
                </ActivityView.Actions>
                {/* (On the glass: its groups on a fill, see List.) */}
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfEyeglasses} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Reading List')}
                        >
                          Add to Reading List
                        </List.Title>
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfBook} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add Bookmark')}
                        >
                          Add Bookmark
                        </List.Title>
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfHeart} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Favorites')}
                        >
                          Add to Favorites
                        </List.Title>
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPlusSquare} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Add to Home Screen')}
                        >
                          Add to Home Screen
                        </List.Title>
                      </List.Item>
                    </List.Group>
                  </List.Section>
                  <List.Section>
                    <List.Group>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPencilTipCropCircle} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Markup')}
                        >
                          Markup
                        </List.Title>
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPrinter} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('action: Print')}
                        >
                          Print
                        </List.Title>
                      </List.Item>
                    </List.Group>
                  </List.Section>
                </List.Root>
                <div className="activity-view-demo-edit">
                  <Button.Root
                    variant="glass"
                    onClick={() => addLog('edit actions')}
                  >
                    <Button.Label>Edit Actions</Button.Label>
                  </Button.Root>
                </div>
              </Popover.Body>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};
