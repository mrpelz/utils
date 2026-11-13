import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  forwardClick,
  List,
  Popover,
  Switch,
  Symbol,
  Toolbar,
  useCreatePopoverHandle,
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
import { sfXmark } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  popoverArrowRows,
  popoverBackdropRows,
  popoverBodyRows,
  popoverCloseRows,
  popoverDescriptionRows,
  popoverHandleRows,
  popoverHandleTypeRows,
  popoverHeaderRows,
  popoverPopupRows,
  popoverPortalRows,
  popoverPositionerRows,
  popoverRootRows,
  popoverTitleRows,
  popoverTriggerRows,
  popoverViewportRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsArrow,
  propOptionsClose,
  propOptionsGuidePositioner,
  propOptionsHeader,
  propOptionsPart,
  propOptionsPopup,
  propOptionsPortal,
  propOptionsScrollContent,
  propOptionsTitle,
  propOptionsTrigger,
} from './props.js';

// Every view writes out its popover (a button's: its bar, its settings, a
// note), the part's props on that part, so its code shows as it'd be used.

/** `Popover.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'popover-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Popover.Root' },
  );

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
            'List.Footer': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Description': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['render'],
            'Switch.Root': ['aria-label', 'defaultChecked'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
      state={[state, partState]}
      title="Popover.Root"
    >
      <Popover.Root
        key={elementKey}
        {...props}
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'popover-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Trigger',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Trigger"
    >
      <Popover.Root {...partProps['Popover.Root']}>
        <Popover.Trigger {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'popover-parts-portal';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Portal',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Portal"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
        <Popover.Portal {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Backdrop`, outlined, with its props. */
const BackdropPart: FunctionComponent = () => {
  const id = 'popover-parts-backdrop';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Backdrop',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Backdrop"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
          <Popover.Backdrop {...props} />
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'popover-parts-positioner';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Positioner',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Positioner"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
          <Popover.Positioner {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'popover-parts-popup';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Popup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Popup"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
            <Popover.Popup {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Arrow`, outlined, with its props. */
const ArrowPart: FunctionComponent = () => {
  const id = 'popover-parts-arrow';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsArrow, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Arrow',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Arrow"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
              <Popover.Arrow {...props} />
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Header`, outlined, with its props. */
const HeaderPart: FunctionComponent = () => {
  const id = 'popover-parts-header';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHeader, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Header',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Popup': ['className', 'style'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Header"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
              style={{ maxHeight: 180 }}
            >
              <Popover.Arrow {...partProps['Popover.Arrow']} />
              <Popover.Header {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Body`, outlined, with its props. */
const BodyPart: FunctionComponent = () => {
  const id = 'popover-parts-body';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsScrollContent, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Body',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Body"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
              <Popover.Body {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Viewport`, outlined, with its props. */
const ViewportPart: FunctionComponent = () => {
  const id = 'popover-parts-viewport';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Viewport',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Viewport"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
              <Popover.Viewport {...props}>
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
                      <List.Footer {...partProps['List.Footer']}>
                        <Popover.Description
                          {...partProps['Popover.Description']}
                        >
                          For this list only.
                        </Popover.Description>
                      </List.Footer>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Viewport>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};

/** `Popover.Title`, outlined, with its props. */
const TitlePart: FunctionComponent = () => {
  const id = 'popover-parts-title';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTitle, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Title',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Close': ['render'],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Title"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
                    <Popover.Title {...props}>Display</Popover.Title>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Description`, outlined, with its props. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'popover-parts-description';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Description',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
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
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Description"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description {...props}>
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `Popover.Close`, outlined, with its props. */
const ClosePart: FunctionComponent = () => {
  const id = 'popover-parts-close';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsClose, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Close',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': ['onClick'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'Popover.Arrow': [],
          'Popover.Body': [],
          'Popover.Description': [],
          'Popover.Header': [],
          'Popover.Popup': ['className'],
          'Popover.Portal': [],
          'Popover.Positioner': [],
          'Popover.Root': [],
          'Popover.Title': ['render'],
          'Popover.Trigger': ['render'],
          'Switch.Root': ['aria-label', 'defaultChecked'],
          'Switch.Thumb': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
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
      state={[state, partState]}
      title="Popover.Close"
    >
      <Popover.Root
        {...partProps['Popover.Root']}
        defaultOpen
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
                    <Popover.Close {...props}>
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

// Its trigger and its button, outside the root: made once, here.
const displayPopover = codeLabel(
  Popover.createHandle(),
  'displayPopover',
  'const displayPopover = Popover.createHandle(); // (at module level)',
);

/** `Popover.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'popover-parts-create-handle';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Description': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': ['handle', 'onOpenChange'],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['handle', 'id', 'render'],
            'Switch.Root': ['aria-label', 'defaultChecked'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Popover.createHandle"
    >
      <div className="popover-demo-triggers">
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          handle={displayPopover}
          id="popover-parts-display-trigger"
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
        <Button.Root
          {...partProps['Button.Root']}
          variant="borderless"
          onClick={() => displayPopover.open('popover-parts-display-trigger')}
        >
          <Button.Label {...partProps['Button.Label']}>
            Open Imperatively
          </Button.Label>
        </Button.Root>
      </div>
      <Popover.Root
        {...partProps['Popover.Root']}
        handle={displayPopover}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
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
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
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

/** `useCreatePopoverHandle`: two triggers, one popover, its title theirs. */
const UseCreatePopoverHandlePart: FunctionComponent = () => {
  const id = 'popover-parts-use-create-popover-handle';
  const [log, addLog] = useLog();
  // Its triggers, outside the root, each with its payload: the title.
  const optionsPopover = codeLabel(
    useCreatePopoverHandle<{ title: string }>(),
    'optionsPopover',
    'const optionsPopover = useCreatePopoverHandle<{ title: string }>();',
  );

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
            'List.Footer': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Description': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': ['handle', 'onOpenChange'],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['handle', 'payload', 'render'],
            'Switch.Root': ['aria-label', 'defaultChecked'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="useCreatePopoverHandle"
    >
      <div className="popover-demo-triggers">
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          handle={optionsPopover}
          payload={{ title: 'Display' }}
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
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          handle={optionsPopover}
          payload={{ title: 'Filter' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Filter Options
          </Button.Label>
        </Popover.Trigger>
      </div>
      <Popover.Root
        {...partProps['Popover.Root']}
        handle={optionsPopover}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
        {({ payload }) => (
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
                        {payload?.title}
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
                      <List.Footer {...partProps['List.Footer']}>
                        <Popover.Description
                          {...partProps['Popover.Description']}
                        >
                          For this list only.
                        </Popover.Description>
                      </List.Footer>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </Popover.Root>
    </Component>
  );
};

/** `/popover/parts`: the root, its trigger, its portal's parts, handles. */
export const PopoverParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: holds its state (open) for its parts.</li>
      <li>Trigger: the control it’s shown from, and anchored to.</li>
      <li>
        Portal, Positioner and Popup: where it renders, where it’s placed, and
        the panel itself (the menus’ glass).
      </li>
      <li>
        Inside the popup: its arrow, its bar (
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        ) and its content (
        <PartLink
          component="popover"
          part="Popover.Body"
        />
        ). Its title, description and close button go wherever they fit.
      </li>
      <li>Handles: triggers outside the root, and opening it from code.</li>
      <li>Press each view’s button to open its popover.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="popover"
          part="Popover.Root"
        />
        <ul>
          <li>
            <PartLink
              component="popover"
              part="Popover.Trigger"
            />{' '}
            (optional; or outside the root, through a handle)
          </li>
          <li>
            <PartLink
              component="popover"
              part="Popover.Portal"
            />
            <ul>
              <li>
                <PartLink
                  component="popover"
                  part="Popover.Backdrop"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="popover"
                  part="Popover.Positioner"
                />
                <ul>
                  <li>
                    <PartLink
                      component="popover"
                      part="Popover.Popup"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="popover"
                          part="Popover.Arrow"
                        />{' '}
                        (optional)
                      </li>
                      <li>
                        <PartLink
                          component="popover"
                          part="Popover.Viewport"
                        />{' '}
                        (optional; around what changes between triggers)
                      </li>
                      <li>
                        <PartLink
                          component="popover"
                          part="Popover.Header"
                        />{' '}
                        (optional)
                        <ul>
                          <li className="demo-tree-context">
                            <PartLink
                              component="toolbar"
                              part="Toolbar.Root"
                            />{' '}
                            <span>(with a</span>{' '}
                            <PartLink
                              component="popover"
                              part="Popover.Title"
                            />{' '}
                            <span>in its</span>{' '}
                            <PartLink
                              component="toolbar"
                              part="Toolbar.Title"
                            />
                            <span>, and a</span>{' '}
                            <PartLink
                              component="popover"
                              part="Popover.Close"
                            />
                            <span>)</span>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="popover"
                          part="Popover.Body"
                        />{' '}
                        (optional; what scrolls)
                        <ul>
                          <li className="demo-tree-context">
                            <PartLink
                              component="viewport"
                              part="Viewport.Padding"
                            />{' '}
                            <span>(with a header: room for its bar)</span>
                          </li>
                          <li className="demo-tree-context">
                            <span>its content (for example a</span>{' '}
                            <PartLink
                              component="list"
                              part="List.Root"
                            />
                            <span>, with a</span>{' '}
                            <PartLink
                              component="popover"
                              part="Popover.Description"
                            />{' '}
                            <span>in a footer)</span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="popover"
          part="Popover.createHandle"
        />{' '}
        (a popover’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="popover"
              part="useCreatePopoverHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="popover-root"
      level={2}
    >
      <code>Popover.Root</code>
    </Heading>
    <ul>
      <li>
        Holds its state: <code>open</code> or <code>defaultOpen</code>, and{' '}
        <code>onOpenChange</code> (with the reason: its trigger pressed, a press
        outside, Escape, or its close button). Also <code>modal</code>.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={popoverRootRows} />

    <Heading
      id="popover-trigger"
      level={2}
    >
      <code>Popover.Trigger</code>
    </Heading>
    <ul>
      <li>
        The control it’s shown from, and anchored to, for example a{' '}
        <a href={publicUrl('button')}>Button</a> (
        <code>{'render={<Button.Root />}'}</code>) or a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        .
      </li>
      <li>
        A press opens or closes it. With <code>openOnHover</code>, hovering does
        too (after <code>delay</code>).
      </li>
      <li>
        It can sit outside the root, through a handle (see{' '}
        <PartLink
          component="popover"
          part="Popover.createHandle"
        />
        ).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={popoverTriggerRows} />

    <Heading
      id="popover-portal"
      level={2}
    >
      <code>Popover.Portal</code>
    </Heading>
    <ul>
      <li>
        It has no box of its own (<code>display: contents</code>), so rendering
        it into a container laid out as a flex column (such as a screen) doesn’t
        shift that container’s content.
      </li>
      <li>
        It renders into the document’s body (<code>container</code>). While
        closed, it renders nothing (or, with <code>keepMounted</code>, stays
        hidden).
      </li>
      <li>
        Renders a <code>div</code> in its container.
      </li>
    </ul>
    <PortalPart />
    <h3>Props</h3>
    <PropsTable rows={popoverPortalRows} />

    <Heading
      id="popover-backdrop"
      level={2}
    >
      <code>Popover.Backdrop</code>
    </Heading>
    <ul>
      <li>
        Optional: a layer under the popup, above the page. It has no styles,
        since a popover doesn’t dim the page. It’s outlined here so you can see
        it.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <BackdropPart />
    <h3>Props</h3>
    <PropsTable rows={popoverBackdropRows} />

    <Heading
      id="popover-positioner"
      level={2}
    >
      <code>Popover.Positioner</code>
    </Heading>
    <ul>
      <li>
        Places the popup at its trigger (or its <code>anchor</code>). Its{' '}
        <code>side</code> is below by default (logical), and its{' '}
        <code>align</code> centered by default. In a{' '}
        <a href={publicUrl('list')}>List</a> row, align it with the row’s end (
        <code>end</code>).
      </li>
      <li>
        It keeps 8px from the trigger (with an arrow, from the arrow’s tip) and
        from the screen’s edges. Without room, it goes to the other side.
      </li>
      <li>
        While a field inside it is typed into and the keyboard covers it, it’s
        lifted as a whole until it’s 8px above the keyboard (like a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        , in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ). Its arrow then no longer points at its trigger.
      </li>
      <li>
        Renders a <code>div</code>, above the page’s layers.
      </li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={popoverPositionerRows} />

    <Heading
      id="popover-popup"
      level={2}
    >
      <code>Popover.Popup</code>
    </Heading>
    <ul>
      <li>
        The panel: the menus’ glass with 13px corners, and the arrow’s wedge as
        part of its outline. It scales in from its trigger.
      </li>
      <li>
        It’s as wide as its content (here 320px, set by the app), and at most as
        tall as the room it has. Beyond that, its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolls.
      </li>
      <li>
        Renders a <code>div</code> (a <code>dialog</code>).
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={popoverPopupRows} />

    <Heading
      id="popover-arrow"
      level={2}
    >
      <code>Popover.Arrow</code>
    </Heading>
    <ul>
      <li>
        Optional: an arrow (a rounded wedge, 56px wide and 13px deep) that
        points at the trigger’s center from whichever side the popup ends up on.
        The popup moves out by its depth.
      </li>
      <li>
        The popup draws it as part of its outline. It renders an empty{' '}
        <code>div</code> where Base UI places it.
      </li>
      <li>
        It’s hidden by default (<code>whenShifted</code>) when the popover has
        shifted so far that it can’t point at the trigger’s center (for example
        with a trigger near a corner of the screen), or when the popover covers
        the trigger (too tall to fit on either side).
      </li>
    </ul>
    <ArrowPart />
    <h3>Props</h3>
    <PropsTable rows={popoverArrowRows} />

    <Heading
      id="popover-header"
      level={2}
    >
      <code>Popover.Header</code>
    </Heading>
    <ul>
      <li>
        Optional: its bar (16px from the top, 10px above the content). It holds
        a <a href={publicUrl('toolbar')}>Toolbar</a> (
        <code>placement=&quot;block-start&quot;</code>) with its title (
        <PartLink
          component="popover"
          part="Popover.Title"
        />
        ) and a close button (
        <PartLink
          component="popover"
          part="Popover.Close"
        />
        ).
      </li>
      <li>
        It sits above the body, which scrolls under it, with an edge effect.{' '}
        <code>edgeEffect</code> is soft by default: the content fades out
        beneath the bar as it scrolls there, and stays clear while at the top.
        It can also be hard or none, with <code>edgeTint</code> for a color. The
        body makes room for it with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start, like a sheet’s content.
      </li>
      <li>
        Popovers without a bar (a <a href={publicUrl('roll')}>Roll</a>, a
        calendar) leave it out.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={popoverHeaderRows} />

    <Heading
      id="popover-body"
      level={2}
    >
      <code>Popover.Body</code>
    </Heading>
    <ul>
      <li>
        Its content. It scrolls once the popup reaches its maximum height (the
        room it has). The popup itself doesn’t scroll, because its glass and
        arrow are drawn around it.
      </li>
      <li>
        With a{' '}
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        , it starts with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        that makes room for the bar it scrolls under.
      </li>
      <li>
        It’s optional. Content that can’t outgrow the room can go in the popup
        directly.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <BodyPart />
    <h3>Props</h3>
    <PropsTable rows={popoverBodyRows} />

    <Heading
      id="popover-viewport"
      level={2}
    >
      <code>Popover.Viewport</code>
    </Heading>
    <ul>
      <li>
        Optional, Base UI’s, without styles. It goes around content that changes
        between triggers (their <code>payload</code>s, see{' '}
        <PartLink
          component="popover"
          part="useCreatePopoverHandle"
        />
        ), so the app can animate the change (through its <code>data-*</code>{' '}
        attributes).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ViewportPart />
    <h3>Props</h3>
    <PropsTable rows={popoverViewportRows} />

    <Heading
      id="popover-title"
      level={2}
    >
      <code>Popover.Title</code>
    </Heading>
    <ul>
      <li>
        Its title (Base UI’s, without styles), which is the popup’s accessible
        name.
      </li>
      <li>
        In its bar, it’s a <code>span</code> in the toolbar’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Title"
        />{' '}
        (<code>{'render={<span />}'}</code>), styled like the toolbar’s title.
      </li>
      <li>
        Renders an <code>h2</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={popoverTitleRows} />

    <Heading
      id="popover-description"
      level={2}
    >
      <code>Popover.Description</code>
    </Heading>
    <ul>
      <li>
        What it’s for (Base UI’s, without styles), which is the popup’s
        accessible description. Here, it’s in a list’s{' '}
        <PartLink
          component="list"
          part="List.Footer"
        />
        .
      </li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={popoverDescriptionRows} />

    <Heading
      id="popover-close"
      level={2}
    >
      <code>Popover.Close</code>
    </Heading>
    <ul>
      <li>
        Closes it (Base UI’s). For example a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        with a close symbol in its bar (
        <code>{'render={<Toolbar.Button />}'}</code>).
      </li>
      <li>
        It’s optional, since a press outside closes it too. In a{' '}
        <code>modal</code> popover, render one, so touch screen readers can
        leave it.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ClosePart />
    <h3>Props</h3>
    <PropsTable rows={popoverCloseRows} />

    <Heading
      id="popover-createhandle"
      level={2}
    >
      <code>Popover.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that links a popover to its triggers outside its root, and
        opens or closes it from code (Base UI’s{' '}
        <code>Popover.createHandle</code>).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="popover"
          part="useCreatePopoverHandle"
        />
        ).
      </li>
      <li>
        Here, it’s made at the module’s top level, with a trigger before the
        root and a button that opens it at that trigger from code (its{' '}
        <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={popoverHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={popoverHandleRows} />

    <Heading
      id="usecreatepopoverhandle"
      level={2}
    >
      <code>useCreatePopoverHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="popover"
          part="Popover.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here, two triggers share one popover, which opens at whichever was
        pressed. Each passes its title as its <code>payload</code>, and the
        root’s children are a function of it.
      </li>
    </ul>
    <UseCreatePopoverHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={popoverHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={popoverHandleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const popoverPartsDemos = [
  RootPart,
  TriggerPart,
  PortalPart,
  BackdropPart,
  PositionerPart,
  PopupPart,
  ArrowPart,
  HeaderPart,
  BodyPart,
  ViewportPart,
  TitlePart,
  DescriptionPart,
  ClosePart,
  CreateHandlePart,
  UseCreatePopoverHandlePart,
];
