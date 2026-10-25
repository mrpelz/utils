import './style.css';

import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
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
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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
  propOptionsClose,
  propOptionsElement,
  propOptionsGuidePositioner,
  propOptionsPart,
  propOptionsPopup,
  propOptionsPortal,
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Popover.Root"
    >
      <Popover.Root
        key={elementKey}
        {...props}
      >
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Trigger"
    >
      <Popover.Root>
        <Popover.Trigger {...props}>
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Portal"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal {...props}>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Backdrop"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Backdrop {...props} />
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Positioner"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner {...props}>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Popup"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup {...props}>
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Arrow',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Arrow"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow {...props} />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Header',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Header"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header {...props}>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Popover.Body',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Body"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body {...props}>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Viewport"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Viewport {...props}>
                <Popover.Header>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <Popover.Title render={<span />}>Display</Popover.Title>
                    </Toolbar.Title>
                    <Toolbar.Trailing>
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfXmark} />
                        </Button.Icon>
                      </Popover.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body>
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        <List.Item onClick={forwardClick('[role=switch]')}>
                          <List.Title>Show Completed</List.Title>
                          <Switch.Root aria-label="Show completed">
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                        <List.Item onClick={forwardClick('[role=switch]')}>
                          <List.Title>Show Notes</List.Title>
                          <Switch.Root
                            defaultChecked
                            aria-label="Show notes"
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                      </List.Group>
                      <List.Footer>
                        <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Title"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title {...props}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Description"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
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

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      state={[state]}
      title="Popover.Close"
    >
      <Popover.Root defaultOpen>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close {...props}>
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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
const displayPopover = codeLabel(Popover.createHandle(), 'displayPopover');

/** `Popover.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'popover-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      id={id}
      log={log}
      title="Popover.createHandle"
    >
      <div className="popover-demo-triggers">
        <Popover.Trigger
          handle={displayPopover}
          id="popover-parts-display-trigger"
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Button.Root
          variant="borderless"
          onClick={() => displayPopover.open('popover-parts-display-trigger')}
        >
          <Button.Label>Open Imperatively</Button.Label>
        </Button.Root>
      </div>
      <Popover.Root
        handle={displayPopover}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup className="popover-demo-popup">
              <Popover.Arrow />
              <Popover.Header>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <Popover.Title render={<span />}>Display</Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Popover.Close
                      render={
                        <Toolbar.Button
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfXmark} />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Completed</List.Title>
                        <Switch.Root aria-label="Show completed">
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Title>Show Notes</List.Title>
                        <Switch.Root
                          defaultChecked
                          aria-label="Show notes"
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                    </List.Group>
                    <List.Footer>
                      <Popover.Description>
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
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="popover"
      id={id}
      log={log}
      title="useCreatePopoverHandle"
    >
      <div className="popover-demo-triggers">
        <Popover.Trigger
          handle={optionsPopover}
          payload={{ title: 'Display' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Display Options</Button.Label>
        </Popover.Trigger>
        <Popover.Trigger
          handle={optionsPopover}
          payload={{ title: 'Filter' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Filter Options</Button.Label>
        </Popover.Trigger>
      </div>
      <Popover.Root
        handle={optionsPopover}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
        {({ payload }) => (
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup className="popover-demo-popup">
                <Popover.Arrow />
                <Popover.Header>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <Popover.Title render={<span />}>
                        {payload?.title}
                      </Popover.Title>
                    </Toolbar.Title>
                    <Toolbar.Trailing>
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfXmark} />
                        </Button.Icon>
                      </Popover.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body>
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        <List.Item onClick={forwardClick('[role=switch]')}>
                          <List.Title>Show Completed</List.Title>
                          <Switch.Root aria-label="Show completed">
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                        <List.Item onClick={forwardClick('[role=switch]')}>
                          <List.Title>Show Notes</List.Title>
                          <Switch.Root
                            defaultChecked
                            aria-label="Show notes"
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Item>
                      </List.Group>
                      <List.Footer>
                        <Popover.Description>
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
      <li>Root: its state (open), for its parts.</li>
      <li>Trigger: the control it’s shown from, and anchored to.</li>
      <li>
        Portal, Positioner, Popup: where it renders, where it’s placed, the
        panel (the menus’ glass).
      </li>
      <li>
        In the popup: its arrow, its bar (
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        ), its content (
        <PartLink
          component="popover"
          part="Popover.Body"
        />
        ); its title, description and close button wherever they go.
      </li>
      <li>Handles: triggers outside the root, opening it imperatively.</li>
      <li>Press each view’s button to open its popover.</li>
    </ul>
    <ul>
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
            (optional; or outside it, by a handle)
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
                        (optional; a toolbar:{' '}
                        <PartLink
                          component="popover"
                          part="Popover.Title"
                        />
                        ,{' '}
                        <PartLink
                          component="popover"
                          part="Popover.Close"
                        />
                        )
                      </li>
                      <li>
                        <PartLink
                          component="popover"
                          part="Popover.Body"
                        />{' '}
                        (optional; what scrolls:{' '}
                        <PartLink
                          component="popover"
                          part="Popover.Description"
                        />
                        , optional)
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
    <ul>
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
        Its state: <code>open</code> or <code>defaultOpen</code>,{' '}
        <code>onOpenChange</code> (with why: its trigger pressed, a press
        outside, Escape, its close button); <code>modal</code>.
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
        The control it’s shown from, and anchored to: e.g. a{' '}
        <a href="button">Button</a> (<code>{'render={<Button.Root />}'}</code>),
        a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        .
      </li>
      <li>
        Pressed, it opens or closes it; with <code>openOnHover</code>, hovered
        too (after <code>delay</code>).
      </li>
      <li>
        Outside the root, by a handle (see{' '}
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
        No box of its own (<code>display: contents</code>): rendered into a
        container laid out as a flex column (e.g. a screen), it doesn’t shift
        its content.
      </li>
      <li>
        Where it renders: the document’s body (<code>container</code>); while
        closed, nothing (<code>keepMounted</code>: hidden).
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
        Optional: a layer under the popup, over the page (unstyled: iOS doesn’t
        dim the page for a popover). Outlined here, to see it.
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
        Places the popup at its trigger (or <code>anchor</code>): its{' '}
        <code>side</code> (below by default; logical), its <code>align</code>{' '}
        (centered by default; in a <a href="list">List</a> row, iOS aligns it
        with the row’s end: <code>end</code>).
      </li>
      <li>
        8px from it (with an arrow, the arrow’s tip) and from the screen’s
        edges; on the other side if there’s no room.
      </li>
      <li>
        Renders a <code>div</code> (above the page’s layers).
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
        The panel: the menus’ glass, 13px corners, the arrow’s wedge part of its
        outline; scaling in from its trigger.
      </li>
      <li>
        As wide as its content (here: 320px, the app’s, UIKit’s{' '}
        <code>preferredContentSize</code>); at most as high as the room for it,
        its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolling.
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
        Optional: Figma’s arrow (a rounded wedge, 56px wide, 13px deep),
        pointing at the trigger’s center from whichever side the popup ends up
        on; the popup moves out by its depth.
      </li>
      <li>
        Drawn by the popup (its outline); renders an empty <code>div</code>{' '}
        where Base UI places it.
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
        Optional: its bar, as Figma’s (16px from the top, 10px above the
        content): a <a href="toolbar">Toolbar</a> (
        <code>placement=&quot;block-start&quot;</code>), its title (
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
        Popovers without a bar (a <a href="roll">Roll</a>, a calendar) leave it
        out.
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
        Its content, scrolling when the popup reaches its maximum height (the
        room for it); the popup itself doesn’t scroll (its glass and arrow are
        drawn around it).
      </li>
      <li>
        Optional: content that can’t outgrow the room goes in the popup as it
        is.
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
        Optional (Base UI’s, unstyled): around content that changes between
        triggers (their <code>payload</code>s, see{' '}
        <PartLink
          component="popover"
          part="useCreatePopoverHandle"
        />
        ), for the app to animate the change (its <code>data-*</code>{' '}
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
      <li>Its title (Base UI’s, unstyled): the popup’s accessible name.</li>
      <li>
        In its bar: a <code>span</code> in the toolbar’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Title"
        />{' '}
        (<code>{'render={<span />}'}</code>), styled as the toolbar’s.
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
        What it’s for (Base UI’s, unstyled): the popup’s accessible description.
        Here: in a list’s{' '}
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
        Closes it (Base UI’s): e.g. a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        in its bar, its close symbol (
        <code>{'render={<Toolbar.Button />}'}</code>).
      </li>
      <li>
        Optional (a press outside closes it too); in a <code>modal</code>{' '}
        popover, render one, so touch screen readers can leave it.
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
        A handle linking a popover to its triggers outside its root, and opening
        or closing it imperatively (Base UI’s <code>Popover.createHandle</code>
        ).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="popover"
          part="useCreatePopoverHandle"
        />
        ).
      </li>
      <li>
        Here: made at the module’s top level; a trigger before the root, and a
        button opening it at that trigger imperatively (its{' '}
        <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
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
        Here: two triggers, one popover, at whichever opened it; each passes its
        title (its <code>payload</code>), the root’s children a function of it.
      </li>
    </ul>
    <UseCreatePopoverHandlePart />
    <h3>Type parameters</h3>
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
