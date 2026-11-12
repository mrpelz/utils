import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Sheet,
  Toolbar,
  useCreateSheetHandle,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  sheetCloseRows,
  sheetContentRows,
  sheetDescriptionRows,
  sheetGrabberRows,
  sheetHandleRows,
  sheetHandleTypeRows,
  sheetHeaderRows,
  sheetPopupRows,
  sheetRootRows,
  sheetSnapGroupRows,
  sheetTitleRows,
  sheetTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  getPropOptionsSnapGroupRoot,
  propOptionsGrabber,
  propOptionsGuidePopup,
  propOptionsHeader,
  propOptionsPart,
  propOptionsSnapGroup,
} from './props.js';

// Each view: a phone's screen, its button presenting the sheet (opened, the
// part is outlined; see its controls).

/** `Sheet.Root`: the sheet's state: its trigger and its popup (no element of its own). */
const RootPart: FunctionComponent = () => {
  const id = 'sheet-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Sheet.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          key={elementKey}
          {...props}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Trigger`: its trigger, outlined. */
const TriggerPart: FunctionComponent = () => {
  const id = 'sheet-parts-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Trigger',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['onOpenChange'],
            'Sheet.Title': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
        >
          <Sheet.Trigger
            {...props}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Popup`: the sheet, outlined. */
const PopupPart: FunctionComponent = () => {
  const id = 'sheet-parts-popup';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuidePopup,
    { external, isOpen: true, emphasize: 'outline', title: 'Sheet.Popup' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            key={elementKey}
            {...props}
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Header`: its header, outlined. */
const HeaderPart: FunctionComponent = () => {
  const id = 'sheet-parts-header';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHeader, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Header',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...props}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {/* (Enough to scroll under it.) */}
                    {names.slice(0, 20).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Grabber`: its grabber, outlined. */
const GrabberPart: FunctionComponent = () => {
  const id = 'sheet-parts-grabber';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGrabber, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Grabber',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Grabber"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...props} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/**
 * `Sheet.SnapGroup`: a place's sheet, revealed group by group (its first
 * group outlined).
 */
const SnapGroupPart: FunctionComponent = () => {
  const id = 'sheet-parts-snap-group';
  const [log, addLog] = useLog();
  const [externalRoot, external] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsSnapGroupRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Sheet.Root' },
  );
  const [control, props, state] = usePropControl(propOptionsSnapGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.SnapGroup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Sheet.SnapGroup (others)': ['value'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': [],
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
      isInline
      controls={[controlRoot, control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state, partState]}
      title="Sheet.SnapGroup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          key={`${keyRoot}`}
          defaultOpen
          {...propsRoot}
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
              Show Place
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
                    Harbor Café
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <Sheet.SnapGroup {...props}>
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      <List.Item {...partProps['List.Item']}>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Open until 6 PM
                          </List.Title>
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Café · 300 m
                          </List.Subtitle>
                        </List.Content>
                      </List.Item>
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Sheet.SnapGroup>
              <Sheet.SnapGroup
                {...partProps['Sheet.SnapGroup (others)']}
                value="details"
              >
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {['Call', 'Website', 'Directions'].map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Sheet.SnapGroup>
              <Sheet.SnapGroup
                {...partProps['Sheet.SnapGroup (others)']}
                value="all"
              >
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {names.map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
                            </List.Title>
                            <List.Subtitle {...partProps['List.Subtitle']}>
                              Review
                            </List.Subtitle>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
              </Sheet.SnapGroup>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Sheet.Content`: its content, outlined. */
const ContentPart: FunctionComponent = () => {
  const id = 'sheet-parts-content';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Content',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Content"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...props}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Title`: its title, outlined. */
const TitlePart: FunctionComponent = () => {
  const id = 'sheet-parts-title';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Title',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Title"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...props}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Description`: its description, outlined. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'sheet-parts-description';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Description',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Description"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...props}>
                      Saved to your contacts.
                    </Sheet.Description>
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

/** `Sheet.Close`: its Done button, outlined. */
const ClosePart: FunctionComponent = () => {
  const id = 'sheet-parts-close';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sheet.Close',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Sheet.Close (others)': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Content': [],
            'Sheet.Description': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['defaultOpen', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Sheet.Close"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultOpen
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
              Add Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close (others)']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...props}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    <Sheet.Description {...partProps['Sheet.Description']}>
                      Saved to your contacts.
                    </Sheet.Description>
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

// Its trigger and its button, outside the root: made once, here.
const contactSheet = codeLabel(
  Sheet.createHandle(),
  'contactSheet',
  'const contactSheet = Sheet.createHandle(); // (at module level)',
);

/** `Sheet.createHandle`: a trigger outside the root, and an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'sheet-parts-create-handle';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['handle', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['handle', 'render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Sheet.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Trigger
          {...partProps['Sheet.Trigger']}
          handle={contactSheet}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Add Contact
          </Button.Label>
        </Sheet.Trigger>
        <Button.Root
          {...partProps['Button.Root']}
          variant="borderless"
          onClick={() => contactSheet.open(null)}
        >
          <Button.Label {...partProps['Button.Label']}>
            Open Imperatively
          </Button.Label>
        </Button.Root>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          handle={contactSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open: ${String(isOpen)} (${reason})`)
          }
        >
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
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
                    {names.slice(0, 3).map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
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

/** `useCreateSheetHandle`: two triggers, one sheet, its title theirs. */
const UseCreateSheetHandlePart: FunctionComponent = () => {
  const id = 'sheet-parts-use-create-sheet-handle';
  const [log, addLog] = useLog();
  // Its triggers, outside the root, each with its payload: the title.
  const addSheet = codeLabel(
    useCreateSheetHandle<{ title: string }>(),
    'addSheet',
    'const addSheet = useCreateSheetHandle<{ title: string }>();',
  );

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
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['handle', 'onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['handle', 'payload', 'render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
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
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="useCreateSheetHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Trigger
          {...partProps['Sheet.Trigger']}
          handle={addSheet}
          payload={{ title: 'Add Contact' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Add Contact
          </Button.Label>
        </Sheet.Trigger>
        <Sheet.Trigger
          {...partProps['Sheet.Trigger']}
          handle={addSheet}
          payload={{ title: 'Add Group' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>Add Group</Button.Label>
        </Sheet.Trigger>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          handle={addSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open: ${String(isOpen)} (${reason})`)
          }
        >
          {({ payload }) => (
            <Sheet.Popup
              {...partProps['Sheet.Popup']}
              compact
              background="grouped"
            >
              <Sheet.Header {...partProps['Sheet.Header']}>
                <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <Sheet.Title
                      {...partProps['Sheet.Title']}
                      render={<span />}
                    >
                      {payload?.title}
                    </Sheet.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Sheet.Close
                      {...partProps['Sheet.Close']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          prominent
                        />
                      }
                    >
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
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
                      {names.slice(0, 3).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
              </Sheet.Content>
            </Sheet.Popup>
          )}
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/sheet/parts`: its root, trigger, popup, header, content, and Base UI's. */
export const SheetParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root that holds the state, its trigger, and its popup: a header (with
        its grabber and a toolbar) above its content.
      </li>
      <li>
        It’s Base UI’s <code>Drawer</code>, with its parts re-exported: the
        title, the description and the close buttons.{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        renders its portal, backdrop and viewport.
      </li>
      <li>Press each view’s button to open its sheet.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />
        <ul>
          <li>
            <PartLink
              component="sheet"
              part="Sheet.Trigger"
            />{' '}
            (optional; or a handle’s trigger, or <code>open</code>)
          </li>
          <li>
            <PartLink
              component="sheet"
              part="Sheet.Popup"
            />
            <ul>
              <li>
                <PartLink
                  component="sheet"
                  part="Sheet.Header"
                />
                <ul>
                  <li>
                    <PartLink
                      component="sheet"
                      part="Sheet.Grabber"
                    />{' '}
                    (optional)
                  </li>
                  <li className="demo-tree-context">
                    <PartLink
                      component="toolbar"
                      part="Toolbar.Root"
                    />{' '}
                    <span>(optional, with</span>{' '}
                    <PartLink
                      component="sheet"
                      part="Sheet.Close"
                    />{' '}
                    <span>buttons and the</span>{' '}
                    <PartLink
                      component="sheet"
                      part="Sheet.Title"
                    />
                    <span>)</span>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="sheet"
                  part="Sheet.Content"
                />
                <ul>
                  <li className="demo-tree-context">
                    <PartLink
                      component="viewport"
                      part="Viewport.Padding"
                    />{' '}
                    <span>(at its start, below a header with a bar)</span>
                  </li>
                  <li>
                    <PartLink
                      component="sheet"
                      part="Sheet.SnapGroup"
                    />{' '}
                    (optional; one per stop, in order)
                  </li>
                  <li className="demo-tree-context">
                    <span>its content (for example a</span>{' '}
                    <PartLink
                      component="list"
                      part="List.Root"
                    />
                    <span>, with a</span>{' '}
                    <PartLink
                      component="sheet"
                      part="Sheet.Description"
                    />{' '}
                    <span>as a footer)</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="sheet"
          part="Sheet.createHandle"
        />{' '}
        (a sheet’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="sheet"
              part="useCreateSheetHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="sheet-root"
      level={2}
    >
      <code>Sheet.Root</code>
    </Heading>
    <ul>
      <li>
        Holds its state: whether it’s open (<code>open</code> or{' '}
        <code>defaultOpen</code>, and <code>onOpenChange</code>), whether it’s
        modal, and whether outside presses dismiss it.
      </li>
      <li>
        It’s Base UI’s <code>Drawer.Root</code>, and its{' '}
        <code>swipeDirection</code> also takes <code>none</code>, so it can’t be
        swiped away at all (its popup ignores swipes). Swiped away in a
        direction other than down, it leaves through that edge.
      </li>
      <li>Renders no element.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={sheetRootRows} />

    <Heading
      id="sheet-trigger"
      level={2}
    >
      <code>Sheet.Trigger</code>
    </Heading>
    <ul>
      <li>
        Opens the sheet, and gets focus back when it closes. Usually a{' '}
        <a href={publicUrl('button')}>Button</a>, through its{' '}
        <code>render</code>.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={sheetTriggerRows} />

    <Heading
      id="sheet-popup"
      level={2}
    >
      <code>Sheet.Popup</code>
    </Heading>
    <ul>
      <li>
        The sheet. <code>detent</code> sets large or medium. When it isn’t{' '}
        <code>compact</code>, it’s a form sheet, or, with <code>regular</code>{' '}
        set to <code>card</code>, a card at the leading edge. It sits in its
        portal, with the page dimmed behind it (Base UI’s <code>Portal</code>{' '}
        and <code>Backdrop</code>).
      </li>
      <li>
        <code>container</code>: here, the phone’s screen. That’s a containing
        block, so the sheet fills the screen rather than the window.
      </li>
      <li>
        <code>background</code>: grouped for grouped lists inside (as here), and
        plain otherwise, like a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        ’s. The app sets it; the sheet doesn’t look at what’s inside.
      </li>
      <li>
        Renders a <code>div</code> (a <code>dialog</code>) inside its viewport’s{' '}
        <code>div</code> (where it’s swiped), with its backdrop’s{' '}
        <code>div</code> before it.
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={sheetPopupRows} />

    <Heading
      id="sheet-header"
      level={2}
    >
      <code>Sheet.Header</code>
    </Heading>
    <ul>
      <li>
        Holds its grabber (
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        ) above a toolbar of the app’s. The sheet can be swiped down by any part
        of it, while its content is scrolled to the top.
      </li>
      <li>
        It sits above the content, which scrolls under it, blurred and faded,
        whatever it holds. That’s its <code>edgeEffect</code>, like a bar’s
        (soft, hard or none), with <code>edgeTint</code>. The content makes room
        with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        first, like a page under its toolbar.
      </li>
      <li>
        With only a grabber, it also sits above the content, without a bar (the
        sheet’s own bars go below it).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={sheetHeaderRows} />

    <Heading
      id="sheet-grabber"
      level={2}
    >
      <code>Sheet.Grabber</code>
    </Heading>
    <ul>
      <li>
        The grabber (36px by 5px, 5px from the top), first in its header. It
        shows that the sheet can be swiped, by any part of the header.
      </li>
      <li>It’s optional. Leave it out for a cleaner top.</li>
      <li>
        Its <code>cursor</code> is <code>grab</code>, and <code>grabbing</code>{' '}
        while the sheet is swiped.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive technology.
      </li>
    </ul>
    <GrabberPart />
    <h3>Props</h3>
    <PropsTable rows={sheetGrabberRows} />

    <Heading
      id="sheet-snapgroup"
      level={2}
    >
      <code>Sheet.SnapGroup</code>
    </Heading>
    <ul>
      <li>
        One of the sheet’s stops. Swiped up, the sheet reveals its content group
        by group, snapping to show everything up to a group’s end (its header
        too, and clear of the home indicator). It’s measured live as the content
        changes.
      </li>
      <li>
        Each stop is named (<code>value</code>). The root’s{' '}
        <code>snapPoint</code>, <code>defaultSnapPoint</code> (the lowest by
        default) and <code>onSnapPointChange</code> take and give those names,
        not heights.
      </li>
      <li>
        While its content is scrolled away from its start (only possible at the
        top stop), the groups in it aren’t stops. Dragging the header down then
        goes to the header-only stop, or closes the sheet if there’s none. Back
        at the start, they’re stops again. When a group’s stop is asked for
        while scrolled away (the root’s <code>snapPoint</code>), the sheet goes
        there and scrolls the content back to its start.
      </li>
      <li>
        Groups follow one another in its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />
        , and the last one holds the rest. When it reaches past the sheet’s
        height, its stop is the whole sheet.
      </li>
      <li>
        Snapping is this library’s own, not Base UI’s. A medium sheet sits in
        its glass capsule as tall as its stop, with its content clipped and
        always above the home indicator. A large one moves down. Below its top
        stop, its content doesn’t scroll, so dragging it drags the sheet. At its
        top stop, it does scroll, until it’s pulled down from its start (by
        touch, or by a wheel or trackpad scroll that started there).
      </li>
      <li>
        When swiped and flung, it moves one stop at a time (and closes when
        flung down from its lowest). Otherwise, it goes to the nearest stop when
        let go.
      </li>
      <li>
        It’s optional. Without groups, the root’s <code>snapPoints</code> (Base
        UI’s) position the sheet, or nothing does.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <SnapGroupPart />
    <h3>Props</h3>
    <PropsTable rows={sheetSnapGroupRows} />

    <Heading
      id="sheet-content"
      level={2}
    >
      <code>Sheet.Content</code>
    </Heading>
    <ul>
      <li>
        What scrolls, under the header. It fills the sheet (a medium sheet is as
        tall as it, up to the screen minus 64px). It starts with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        (<code>edge=&quot;block-start&quot;</code>) that makes room for a header
        with more than a grabber.
      </li>
      <li>
        Its end scrolls clear of the home indicator (padded by the bottom safe
        area inset, except on a medium sheet, which sits above it), and the
        sheet’s background reaches the edge.
      </li>
      <li>
        A text field typed into inside it is scrolled into view above the
        on-screen keyboard (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ). With stops, that happens at its top stop only.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ContentPart />
    <h3>Props</h3>
    <PropsTable rows={sheetContentRows} />

    <Heading
      id="sheet-title"
      level={2}
    >
      <code>Sheet.Title</code>
    </Heading>
    <ul>
      <li>
        Names the sheet. It’s Base UI’s, without styles, here rendered as the
        toolbar’s title (<code>render</code>, a <code>span</code>).
      </li>
      <li>
        Renders an <code>h2</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={sheetTitleRows} />

    <Heading
      id="sheet-description"
      level={2}
    >
      <code>Sheet.Description</code>
    </Heading>
    <ul>
      <li>
        Describes the sheet. It’s Base UI’s, without styles, here a list’s
        footer.
      </li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={sheetDescriptionRows} />

    <Heading
      id="sheet-close"
      level={2}
    >
      <code>Sheet.Close</code>
    </Heading>
    <ul>
      <li>
        Closes the sheet, as Cancel or Done (its own <code>onClick</code> runs
        first, for example to save). Usually a toolbar’s button, through its{' '}
        <code>render</code>.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ClosePart />
    <h3>Props</h3>
    <PropsTable rows={sheetCloseRows} />

    <Heading
      id="sheet-createhandle"
      level={2}
    >
      <code>Sheet.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that links a sheet to its triggers outside its root, and opens
        or closes it from code (Base UI’s <code>Drawer.createHandle</code>).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="sheet"
          part="useCreateSheetHandle"
        />
        ).
      </li>
      <li>
        Here, it’s made at the module’s top level, with a trigger before the
        root and a button that opens it from code (its <code>open()</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={sheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={sheetHandleRows} />

    <Heading
      id="usecreatesheethandle"
      level={2}
    >
      <code>useCreateSheetHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="sheet"
          part="Sheet.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here, two triggers open one sheet. Each passes its title as its{' '}
        <code>payload</code>, and the root’s children are a function of it.
      </li>
    </ul>
    <UseCreateSheetHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={sheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={sheetHandleRows} />

    <Heading
      id="base-ui-s-other-parts"
      level={2}
    >
      Base UI’s other parts
    </Heading>
    <ul>
      <li>
        These are re-exported as they are, without styles (see{' '}
        <a
          href="https://base-ui.com/react/components/drawer"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Drawer
        </a>
        ):
      </li>
      <li>
        <code>Sheet.Portal</code>, <code>Sheet.Backdrop</code> and{' '}
        <code>Sheet.Viewport</code>:{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        renders them (its container, the dimmed page, and where it’s swiped).
      </li>
      <li>
        <code>Sheet.SwipeArea</code>: an area a sheet is swiped open from. These
        sheets don’t use it, since the app presents them.
      </li>
      <li>
        <code>Sheet.Provider</code>, <code>Sheet.Indent</code> and{' '}
        <code>Sheet.IndentBackground</code>: they scale the page behind back
        while a sheet is open, for a stacked look. They’re not used here (see
        the overview).
      </li>
      <li>
        <code>Sheet.VirtualKeyboardProvider</code>: keeps a sheet with fields
        above the on-screen keyboard.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetPartsDemos = [
  RootPart,
  TriggerPart,
  PopupPart,
  HeaderPart,
  GrabberPart,
  SnapGroupPart,
  ContentPart,
  TitlePart,
  DescriptionPart,
  ClosePart,
  CreateHandlePart,
  UseCreateSheetHandlePart,
];
