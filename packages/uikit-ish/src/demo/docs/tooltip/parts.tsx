import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Symbol,
  Tooltip,
  useCreateTooltipHandle,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfPlusSquareOnSquare,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import {
  tooltipHandleRows,
  tooltipHandleTypeRows,
  tooltipPopupRows,
  tooltipPortalRows,
  tooltipPositionerRows,
  tooltipProviderRows,
  tooltipRootRows,
  tooltipTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsGuidePositioner,
  propOptionsGuideTrigger,
  propOptionsPopup,
  propOptionsPortal,
  propOptionsProvider,
} from './props.js';

// Every view writes out its tooltip (a share button's), the part's props on
// that part, so its code shows as it'd be used.

/** `Tooltip.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'tooltip-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Tooltip.Root' },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Tooltip.Root"
    >
      <Tooltip.Root
        key={elementKey}
        {...props}
      >
        <Tooltip.Trigger
          aria-label="Share"
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'tooltip-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Trigger',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      state={[state]}
      title="Tooltip.Trigger"
    >
      <Tooltip.Root>
        <Tooltip.Trigger
          aria-label="Share"
          {...props}
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'tooltip-parts-portal';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Portal',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      state={[state]}
      title="Tooltip.Portal"
    >
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger
          aria-label="Share"
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...props}>
          <Tooltip.Positioner>
            <Tooltip.Popup>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'tooltip-parts-positioner';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Positioner',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      state={[state]}
      title="Tooltip.Positioner"
    >
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger
          aria-label="Share"
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner {...props}>
            <Tooltip.Popup>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'tooltip-parts-popup';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Popup',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      state={[state]}
      title="Tooltip.Popup"
    >
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger
          aria-label="Share"
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup {...props}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Provider`, with its props: three buttons' tooltips. */
const ProviderPart: FunctionComponent = () => {
  const id = 'tooltip-parts-provider';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsProvider, {
    external,
    title: 'Tooltip.Provider',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control]}
      id={id}
      state={[state]}
      title="Tooltip.Provider"
    >
      <Tooltip.Provider {...props}>
        <div className="tooltip-demo-buttons">
          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Share"
              render={
                <Button.Root
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon>
                <Symbol icon={sfSquareAndArrowUp} />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>Share</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Duplicate"
              render={
                <Button.Root
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon>
                <Symbol icon={sfPlusSquareOnSquare} />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>Duplicate</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Delete"
              render={
                <Button.Root
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon>
                <Symbol icon={sfTrash} />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>Delete</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </Tooltip.Provider>
    </Component>
  );
};
// Its trigger and its button, outside the root: made once, here.
const shareTooltip = codeLabel(
  Tooltip.createHandle(),
  'shareTooltip',
  'const shareTooltip = Tooltip.createHandle(); // (at module level)',
);

/** `Tooltip.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'tooltip-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      id={id}
      log={log}
      title="Tooltip.createHandle"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Trigger
          aria-label="Share"
          handle={shareTooltip}
          id="tooltip-parts-share-trigger"
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Button.Root
          variant="borderless"
          onClick={() => shareTooltip.open('tooltip-parts-share-trigger')}
        >
          <Button.Label>Open Imperatively</Button.Label>
        </Button.Root>
      </div>
      <Tooltip.Root
        handle={shareTooltip}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `useCreateTooltipHandle`: two triggers, one tooltip, its text theirs. */
const UseCreateTooltipHandlePart: FunctionComponent = () => {
  const id = 'tooltip-parts-use-create-tooltip-handle';
  // Its triggers, outside the root, each with its payload: its text.
  const toolbarTooltip = codeLabel(
    useCreateTooltipHandle<{ text: string }>(),
    'toolbarTooltip',
    'const toolbarTooltip = useCreateTooltipHandle<{ text: string }>();',
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      id={id}
      title="useCreateTooltipHandle"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Trigger
          aria-label="Duplicate"
          handle={toolbarTooltip}
          payload={{ text: 'Duplicate' }}
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfPlusSquareOnSquare} />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Trigger
          aria-label="Delete"
          handle={toolbarTooltip}
          payload={{ text: 'Delete' }}
          render={
            <Button.Root
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfTrash} />
          </Button.Icon>
        </Tooltip.Trigger>
      </div>
      <Tooltip.Root handle={toolbarTooltip}>
        {({ payload }) => (
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>{payload?.text}</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Component>
  );
};

/** `/tooltip/parts`: its provider, root, trigger, portal's parts, handles. */
export const TooltipParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Provider: shared delays for several tooltips (optional).</li>
      <li>Root: its state (open), for its parts.</li>
      <li>Trigger: the control it labels.</li>
      <li>
        Portal, Positioner, Popup: where it renders, its place, the capsule.
      </li>
      <li>Handles: triggers outside the root, opening it imperatively.</li>
      <li>Hover (or focus) each view’s button to show its tooltip.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />{' '}
        (optional, around several)
        <ul>
          <li>
            <PartLink
              component="tooltip"
              part="Tooltip.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="tooltip"
                  part="Tooltip.Trigger"
                />{' '}
                (optional; or outside it, by a handle; or an <code>anchor</code>
                , held open)
              </li>
              <li>
                <PartLink
                  component="tooltip"
                  part="Tooltip.Portal"
                />
                <ul>
                  <li>
                    <PartLink
                      component="tooltip"
                      part="Tooltip.Positioner"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="tooltip"
                          part="Tooltip.Popup"
                        />
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
          component="tooltip"
          part="Tooltip.createHandle"
        />{' '}
        (a tooltip’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="tooltip"
              part="useCreateTooltipHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="tooltip-provider"
      level={2}
    >
      <code>Tooltip.Provider</code>
    </Heading>
    <ul>
      <li>
        Optional, around several tooltips (e.g. a toolbar’s): once one has
        shown, the next shows at once (within its <code>timeout</code>).
      </li>
      <li>
        Its <code>delay</code> applies to its triggers (unless they set their
        own); without a provider, a trigger’s is 300ms.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <ProviderPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipProviderRows} />

    <Heading
      id="tooltip-root"
      level={2}
    >
      <code>Tooltip.Root</code>
    </Heading>
    <ul>
      <li>
        Its state: shown on hover and keyboard focus (not on touch),{' '}
        <code>onOpenChange</code> (with why); held open by <code>open</code>.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipRootRows} />

    <Heading
      id="tooltip-trigger"
      level={2}
    >
      <code>Tooltip.Trigger</code>
    </Heading>
    <ul>
      <li>
        The control it labels (e.g. a symbol <a href="button">Button</a>:{' '}
        <code>{'render={<Button.Root />}'}</code>): hovered for its{' '}
        <code>delay</code> (300ms, or its provider’s), or focused by keyboard.
      </li>
      <li>
        Its own action unchanged (a click closes the tooltip:{' '}
        <code>closeOnClick</code>).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipTriggerRows} />

    <Heading
      id="tooltip-portal"
      level={2}
    >
      <code>Tooltip.Portal</code>
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
    <PropsTable rows={tooltipPortalRows} />

    <Heading
      id="tooltip-positioner"
      level={2}
    >
      <code>Tooltip.Positioner</code>
    </Heading>
    <ul>
      <li>
        Places it: above its trigger (<code>side</code>, logical), centered (
        <code>align</code>), 8px from it and from the screen’s edges; below it
        if there’s no room.
      </li>
      <li>
        Renders a <code>div</code> (above the page’s layers).
      </li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipPositionerRows} />

    <Heading
      id="tooltip-popup"
      level={2}
    >
      <code>Tooltip.Popup</code>
    </Heading>
    <ul>
      <li>
        The capsule: the menus’ glass, its text Subheadline, 6px by 12px in (one
        line: 32px high; more: 16px corners); scaling in from its trigger.
      </li>
      <li>
        Not hoverable itself (no pointer events): a label, nothing to press.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipPopupRows} />

    <Heading
      id="tooltip-createhandle"
      level={2}
    >
      <code>Tooltip.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking a tooltip to its triggers outside its root, and opening
        or closing it imperatively (Base UI’s <code>Tooltip.createHandle</code>
        ).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="tooltip"
          part="useCreateTooltipHandle"
        />
        ).
      </li>
      <li>
        Here: a trigger before the root, and a button opening it at that trigger
        (its <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={tooltipHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={tooltipHandleRows} />

    <Heading
      id="usecreatetooltiphandle"
      level={2}
    >
      <code>useCreateTooltipHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="tooltip"
          part="Tooltip.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here: two triggers, one tooltip; each passes its text (its{' '}
        <code>payload</code>), the root’s children a function of it.
      </li>
    </ul>
    <UseCreateTooltipHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={tooltipHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={tooltipHandleRows} />

    <Heading
      id="base-ui-s-other-parts"
      level={2}
    >
      Base UI’s other parts
    </Heading>
    <ul>
      <li>
        Re-exported as they are (unstyled; see{' '}
        <a
          href="https://base-ui.com/react/components/tooltip"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Tooltip
        </a>
        ):
      </li>
      <li>
        <code>Tooltip.Arrow</code>: not used (these glass capsules have none).
      </li>
      <li>
        <code>Tooltip.Viewport</code>: around content that changes between
        triggers, for the app to animate.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipPartsDemos = [
  ProviderPart,
  RootPart,
  TriggerPart,
  PortalPart,
  PositionerPart,
  PopupPart,
  CreateHandlePart,
  UseCreateTooltipHandlePart,
];
