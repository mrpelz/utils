import '../sheet/style.css';
import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  forwardClick,
  List,
  Popover,
  Sheet,
  Switch,
  Symbol,
  Toolbar,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfICircle,
  sfLine3HorizontalDecreaseCircle,
  sfXmark,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { propOptionsPresentation } from './props.js';

/** A network's row: its info button, its details in a popover at its end. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Accessory': ['render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': ['align'],
            'Popover.Root': ['onOpenChange'],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['aria-label', 'render'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('popover-composition-list-row') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[partControls]}
      id="popover-composition-list-row"
      log={log}
      state={[partState]}
      title="Popover in a list row"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Home Network
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Popover.Root
                  {...partProps['Popover.Root']}
                  onOpenChange={(isOpen: boolean) =>
                    addLog(`details: ${String(isOpen)}`)
                  }
                >
                  <Popover.Trigger
                    {...partProps['Popover.Trigger']}
                    aria-label="Details"
                    render={
                      <List.Accessory
                        {...partProps['List.Accessory']}
                        render={<button type="button" />}
                      />
                    }
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfICircle}
                    />
                  </Popover.Trigger>
                  <Popover.Portal {...partProps['Popover.Portal']}>
                    <Popover.Positioner
                      {...partProps['Popover.Positioner']}
                      align="end"
                    >
                      <Popover.Popup
                        {...partProps['Popover.Popup']}
                        className="popover-demo-popup"
                      >
                        <Popover.Arrow {...partProps['Popover.Arrow']} />
                        <Popover.Header {...partProps['Popover.Header']}>
                          <Toolbar.Root
                            {...partProps['Toolbar.Root']}
                            placement="block-start"
                          >
                            <Toolbar.Title {...partProps['Toolbar.Title']}>
                              <Popover.Title
                                {...partProps['Popover.Title']}
                                render={<span />}
                              >
                                Home Network
                              </Popover.Title>
                            </Toolbar.Title>
                          </Toolbar.Root>
                        </Popover.Header>
                        <Popover.Body {...partProps['Popover.Body']}>
                          <Viewport.Padding
                            {...partProps['Viewport.Padding']}
                            edge="block-start"
                          />
                          <List.Root {...partProps['List.Root']}>
                            <List.Section {...partProps['List.Section']}>
                              <List.Group {...partProps['List.Group']}>
                                <List.Item {...partProps['List.Item']}>
                                  <List.Content {...partProps['List.Content']}>
                                    <List.Title {...partProps['List.Title']}>
                                      IP Address
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing
                                    {...partProps['List.Trailing']}
                                  >
                                    <List.Detail {...partProps['List.Detail']}>
                                      192.168.1.24
                                    </List.Detail>
                                  </List.Trailing>
                                </List.Item>
                                <List.Item {...partProps['List.Item']}>
                                  <List.Content {...partProps['List.Content']}>
                                    <List.Title {...partProps['List.Title']}>
                                      Router
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing
                                    {...partProps['List.Trailing']}
                                  >
                                    <List.Detail {...partProps['List.Detail']}>
                                      192.168.1.1
                                    </List.Detail>
                                  </List.Trailing>
                                </List.Item>
                              </List.Group>
                            </List.Section>
                          </List.Root>
                        </Popover.Body>
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const inAListRowCode = `<List.Item>
  <List.Content>
    <List.Title>Home Network</List.Title>
  </List.Content>
  <List.Trailing>
    <Popover.Root>
      <Popover.Trigger
        aria-label="Details"
        render={<List.Accessory render={<button type="button" />} />}
      >
        <Symbol icon={sfICircle} />
      </Popover.Trigger>
      <Popover.Portal>
        {/* Aligned with the row's end. */}
        <Popover.Positioner align="end">
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Header>
              <Toolbar.Root placement="block-start">
                <Toolbar.Title>
                  <Popover.Title render={<span />}>Home Network</Popover.Title>
                </Toolbar.Title>
              </Toolbar.Root>
            </Popover.Header>
            <Popover.Body>
              <Viewport.Padding edge="block-start" />
              <List.Root>…</List.Root>
            </Popover.Body>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </List.Trailing>
</List.Item>`;

const fromAToolbarButtonCode = `<Toolbar.Root placement="block-start">
  <Toolbar.Title>
    <span>Inbox</span>
  </Toolbar.Title>
  <Toolbar.Trailing>
    <Popover.Root>
      <Popover.Trigger
        aria-label="Filter"
        render={<Toolbar.Button shape="circle" />}
      >
        <Button.Icon>
          <Symbol icon={sfLine3HorizontalDecreaseCircle} />
        </Button.Icon>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Header>…</Popover.Header>
            <Popover.Body>
              <Viewport.Padding edge="block-start" />
              <List.Root>…</List.Root>
            </Popover.Body>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </Toolbar.Trailing>
</Toolbar.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const contentThatScrollsCode = `<Popover.Root>
  <Popover.Trigger render={<Button.Root />}>
    <Button.Label>Share With</Button.Label>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner>
      {/* At most 360px tall: the body scrolls beyond. */}
      <Popover.Popup style={{ maxHeight: 360 }}>
        <Popover.Arrow />
        <Popover.Header>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <Popover.Title render={<span />}>Share With</Popover.Title>
            </Toolbar.Title>
          </Toolbar.Root>
        </Popover.Header>
        <Popover.Body>
          <Viewport.Padding edge="block-start" />
          <List.Root>…</List.Root>
        </Popover.Body>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>`;

const adaptiveCode = `// A popover in a regular width, a sheet in a compact one.
const sheet = useSizeClass() === 'compact';

sheet ? (
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root />}>…</Sheet.Trigger>
    <Sheet.Popup detent="medium">
      <Sheet.Header>
        <Sheet.Grabber />
        <Toolbar.Root placement="block-start">…</Toolbar.Root>
      </Sheet.Header>
      <Sheet.Content>
        <Viewport.Padding edge="block-start" />
        {/* the same content */}
      </Sheet.Content>
    </Sheet.Popup>
  </Sheet.Root>
) : (
  <Popover.Root>
    <Popover.Trigger render={<Button.Root />}>…</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <Popover.Arrow />
          <Popover.Header>
            <Toolbar.Root placement="block-start">…</Toolbar.Root>
          </Popover.Header>
          <Popover.Body>
            <Viewport.Padding edge="block-start" />
            {/* the same content */}
          </Popover.Body>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);`;

/**
 * Display options: in a popover (a regular width), or a sheet (a compact
 * one; or as set), the same content.
 */
const ASheetOnIPhone: FunctionComponent = () => {
  const id = 'popover-composition-sheet';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(propOptionsPresentation, {
    external,
    isOpen: true,
    title: '[content]',
  });
  const isSheet =
    (content.presentation ??
      (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet';

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': ['onOpenChange'],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': ['onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Switch.Root': ['aria-label', 'defaultChecked'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
      isCentered
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[state, partState]}
      title="Popover or sheet"
    >
      {isSheet ? (
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Sheet.Root
            {...partProps['Sheet.Root']}
            onOpenChange={(isOpen: boolean) =>
              addLog(`sheet: ${String(isOpen)}`)
            }
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
              <Button.Label {...partProps['Button.Label']}>
                Display Options
              </Button.Label>
            </Sheet.Trigger>
            <Sheet.Popup
              {...partProps['Sheet.Popup']}
              compact
              detent="medium"
            >
              <Sheet.Header {...partProps['Sheet.Header']}>
                <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <Sheet.Title
                      {...partProps['Sheet.Title']}
                      render={<span />}
                    >
                      Display
                    </Sheet.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Sheet.Close
                      {...partProps['Sheet.Close']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          aria-label="Close"
                          shape="circle"
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
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Sheet.Header>
              <Sheet.Content {...partProps['Sheet.Content']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      <List.Item
                        {...partProps['List.Item']}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Show Completed
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            aria-label="Show completed"
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                      <List.Item
                        {...partProps['List.Item']}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Show Notes
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            defaultChecked
                            aria-label="Show notes"
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
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
      ) : (
        <Popover.Root
          {...partProps['Popover.Root']}
          onOpenChange={(isOpen: boolean) =>
            addLog(`popover: ${String(isOpen)}`)
          }
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
            <Button.Label {...partProps['Button.Label']}>
              Display Options
            </Button.Label>
          </Popover.Trigger>
          <Popover.Portal {...partProps['Popover.Portal']}>
            <Popover.Positioner {...partProps['Popover.Positioner']}>
              <Popover.Popup
                {...partProps['Popover.Popup']}
                className="popover-demo-popup"
              >
                <Popover.Arrow {...partProps['Popover.Arrow']} />
                <Popover.Header {...partProps['Popover.Header']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <Popover.Title
                        {...partProps['Popover.Title']}
                        render={<span />}
                      >
                        Display
                      </Popover.Title>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                      <Popover.Close
                        {...partProps['Popover.Close']}
                        render={
                          <Toolbar.Button
                            {...partProps['Toolbar.Button']}
                            aria-label="Close"
                            shape="circle"
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
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body {...partProps['Popover.Body']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        <List.Item
                          {...partProps['List.Item']}
                          onClick={forwardClick('[role=switch]')}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              Show Completed
                            </List.Title>
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            <Switch.Root
                              {...partProps['Switch.Root']}
                              aria-label="Show completed"
                            >
                              <Switch.Thumb {...partProps['Switch.Thumb']} />
                            </Switch.Root>
                          </List.Trailing>
                        </List.Item>
                        <List.Item
                          {...partProps['List.Item']}
                          onClick={forwardClick('[role=switch]')}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              Show Notes
                            </List.Title>
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            <Switch.Root
                              {...partProps['Switch.Root']}
                              defaultChecked
                              aria-label="Show notes"
                            >
                              <Switch.Thumb {...partProps['Switch.Thumb']} />
                            </Switch.Root>
                          </List.Trailing>
                        </List.Item>
                      </List.Group>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};

/** A toolbar's filter button, its options in a popover below it. */
const FromAToolbarButton: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': [],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['aria-label', 'render'],
            'Switch.Root': ['aria-label', 'onCheckedChange'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('popover-composition-toolbar') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[partControls]}
      id="popover-composition-toolbar"
      log={log}
      state={[partState]}
      title="Popover from a toolbar button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Popover.Root {...partProps['Popover.Root']}>
              <Popover.Trigger
                {...partProps['Popover.Trigger']}
                aria-label="Filter"
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
                    icon={sfLine3HorizontalDecreaseCircle}
                  />
                </Button.Icon>
              </Popover.Trigger>
              <Popover.Portal {...partProps['Popover.Portal']}>
                <Popover.Positioner {...partProps['Popover.Positioner']}>
                  <Popover.Popup
                    {...partProps['Popover.Popup']}
                    className="popover-demo-popup"
                  >
                    <Popover.Arrow {...partProps['Popover.Arrow']} />
                    <Popover.Header {...partProps['Popover.Header']}>
                      <Toolbar.Root
                        {...partProps['Toolbar.Root']}
                        placement="block-start"
                      >
                        <Toolbar.Title {...partProps['Toolbar.Title']}>
                          <Popover.Title
                            {...partProps['Popover.Title']}
                            render={<span />}
                          >
                            Filter
                          </Popover.Title>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Popover.Header>
                    <Popover.Body {...partProps['Popover.Body']}>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-start"
                      />
                      <List.Root {...partProps['List.Root']}>
                        <List.Section {...partProps['List.Section']}>
                          <List.Group {...partProps['List.Group']}>
                            <List.Item
                              {...partProps['List.Item']}
                              onClick={forwardClick('[role=switch]')}
                            >
                              <List.Content {...partProps['List.Content']}>
                                <List.Title {...partProps['List.Title']}>
                                  Unread
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <Switch.Root
                                  {...partProps['Switch.Root']}
                                  aria-label="Unread"
                                  onCheckedChange={(isChecked: boolean) =>
                                    addLog(`unread: ${String(isChecked)}`)
                                  }
                                >
                                  <Switch.Thumb
                                    {...partProps['Switch.Thumb']}
                                  />
                                </Switch.Root>
                              </List.Trailing>
                            </List.Item>
                            <List.Item
                              {...partProps['List.Item']}
                              onClick={forwardClick('[role=switch]')}
                            >
                              <List.Content {...partProps['List.Content']}>
                                <List.Title {...partProps['List.Title']}>
                                  Flagged
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <Switch.Root
                                  {...partProps['Switch.Root']}
                                  aria-label="Flagged"
                                  onCheckedChange={(isChecked: boolean) =>
                                    addLog(`flagged: ${String(isChecked)}`)
                                  }
                                >
                                  <Switch.Thumb
                                    {...partProps['Switch.Thumb']}
                                  />
                                </Switch.Root>
                              </List.Trailing>
                            </List.Item>
                          </List.Group>
                        </List.Section>
                      </List.Root>
                    </Popover.Body>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** A long list in its body: the bar stays, the list scrolls. */
const ScrollingContent: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Header': [],
            'Popover.Popup': ['className', 'style'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': [],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['render'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('popover-composition-scrolling') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[partControls]}
      id="popover-composition-scrolling"
      log={log}
      state={[partState]}
      title="Popover with scrolling content"
    >
      <Popover.Root {...partProps['Popover.Root']}>
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
          <Button.Label {...partProps['Button.Label']}>Share With</Button.Label>
        </Popover.Trigger>
        <Popover.Portal {...partProps['Popover.Portal']}>
          <Popover.Positioner {...partProps['Popover.Positioner']}>
            <Popover.Popup
              {...partProps['Popover.Popup']}
              className="popover-demo-popup"
              style={{ maxHeight: 360 }}
            >
              <Popover.Arrow {...partProps['Popover.Arrow']} />
              <Popover.Header {...partProps['Popover.Header']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <Popover.Title
                      {...partProps['Popover.Title']}
                      render={<span />}
                    >
                      Share With
                    </Popover.Title>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body {...partProps['Popover.Body']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {names.map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
                              render={<button type="button" />}
                              onClick={() => addLog(`share with ${name}`)}
                            >
                              {name}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Popover.Body>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-list-row', 'In a list row'],
  ['a-sheet-in-a-compact-width', 'A sheet in a compact width'],
  ['from-a-toolbar-button', 'From a toolbar button'],
  ['content-that-scrolls', 'Content that scrolls'],
];

/** `/popover/composition`: popovers with other components. */
export const PopoverComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        A row’s info button (
        <PartLink
          component="list"
          part="List.Accessory"
        />
        , with its symbol at the row’s end, as far in as the row’s other slots)
        shows details about the row’s item.
      </li>
      <li>
        It’s aligned with the row’s end (
        <PartLink
          component="popover"
          part="Popover.Positioner"
        />
        ’s <code>align=&quot;end&quot;</code>; centered by default).
      </li>
      <li>
        <strong>Library:</strong> the popover (
        <PartLink
          component="popover"
          part="Popover.Root"
        />
        , with its arrow, header and body), and aligning it with the row’s end (
        <PartLink
          component="popover"
          part="Popover.Positioner"
        />{' '}
        <code>align</code>).
      </li>
      <li>
        <strong>Demo:</strong> the row’s item and its details.
      </li>
    </ul>
    <CodeView code={inAListRowCode} />
    <InAListRow />

    <Heading
      id="a-sheet-in-a-compact-width"
      level={2}
    >
      A sheet in a compact width
    </Heading>
    <ul>
      <li>
        On a compact width, a popover’s content shows as a sheet. Here, the app
        chooses that with{' '}
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        : a <a href={publicUrl('sheet')}>Sheet</a> with the same bar and content
        (in its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        >
          Header
        </PartLink>{' '}
        and{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        >
          Content
        </PartLink>
        ).
      </li>
      <li>Resize the window, or choose the presentation.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />{' '}
        and the{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        , and the window’s size class (<code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> choosing between them by the size class (or the
        presentation control), with the same content written into both.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <ASheetOnIPhone />

    <Heading
      id="from-a-toolbar-button"
      level={2}
    >
      From a toolbar button
    </Heading>
    <ul>
      <li>
        A <a href={publicUrl('toolbar')}>Toolbar</a>’s button (
        <code>{'render={<Toolbar.Button />}'}</code>) shows options about the
        page, below the button, with its arrow pointing at it.
      </li>
      <li>
        For commands, or one choice among several, use a{' '}
        <a href={publicUrl('menu')}>Menu</a> instead.
      </li>
      <li>
        <strong>Library:</strong> the popover’s trigger rendering the toolbar’s
        button, and its arrow.
      </li>
      <li>
        <strong>Demo:</strong> the options inside it.
      </li>
    </ul>
    <CodeView code={fromAToolbarButtonCode} />
    <FromAToolbarButton />

    <Heading
      id="content-that-scrolls"
      level={2}
    >
      Content that scrolls
    </Heading>
    <ul>
      <li>
        Its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolls once the popup reaches its maximum height: the room it has, or
        less (here 360px, set by the app). Its bar stays, and the rows scroll
        under it, fading out beneath it (clear at the top).
      </li>
      <li>
        <strong>Library:</strong> the body (
        <PartLink
          component="popover"
          part="Popover.Body"
        />
        ) scrolling under the bar (with its edge effect) once the popup reaches
        its maximum height.
      </li>
      <li>
        <strong>Demo:</strong> the maximum height (360px), the rows, and the
        body’s room for the bar (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ).
      </li>
    </ul>
    <CodeView code={contentThatScrollsCode} />
    <ScrollingContent />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const popoverCompositionDemos = [
  InAListRow,
  ASheetOnIPhone,
  FromAToolbarButton,
  ScrollingContent,
];
