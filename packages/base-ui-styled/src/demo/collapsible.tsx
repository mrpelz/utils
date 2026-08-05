import { Collapsible as BaseCollapsible } from '@base-ui/react';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Collapsible } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  html,
  MappedProp,
  useLog,
  usePropControl,
} from '../demo-utils/main.js';

const propOptionsContent = {
  trigger: ['Notifications'] as const,
  panel: [
    new MappedProp(
      <>
        <div>You are all caught up.</div>
        <div>No new notifications at this time.</div>
      </>,
      '[two divs]',
    ),
    new MappedProp(
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>,
      '[looong text]',
    ),
  ] as const,
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  defaultOpen: [undefined, true, false] as const,
  open: [undefined, true, false] as const,
  disabled: [undefined, false, true] as const,
  maxWidth: [undefined, 'none', '20rem'] as const,
} as const;

const propOptionsTrigger = {
  ...commonPropOptions,
  nativeButton: [undefined, false, true] as const,
  cursorClosed: [undefined, 'auto', 'pointer', 'copy'] as const,
  cursorOpen: [undefined, 'auto', 'pointer', 'crosshair'] as const,
} as const;

const propOptionsPanel = {
  ...commonPropOptions,
  hiddenUntilFound: [undefined, false, true] as const,
  keepMounted: [undefined, false, true] as const,
  takeExpandedWidth: [undefined, false, true] as const,
} as const;

export const CollapsibleDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, { trigger, panel }] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onOpenChange: [
          new MappedProp(
            (
              value: boolean,
              { reason }: BaseCollapsible.Root.ChangeEventDetails,
            ) => addLog(`root value: ${value}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlTrigger, propsTrigger] = usePropControl(
    propOptionsTrigger,
    'trigger',
  );

  const [controlPanel, propsPanel] = usePropControl(propOptionsPanel, 'panel');

  return (
    <Component
      backdrop
      center
      controls={[controlContent, controlRoot, controlTrigger, controlPanel]}
      id="collapsible"
      log={log}
      title="Collapsible"
    >
      <RemounterRoot>
        <Collapsible.Root {...propsRoot}>
          <Collapsible.Trigger {...propsTrigger}>
            {trigger}
            <Collapsible.Icon />
          </Collapsible.Trigger>
          <Collapsible.Panel {...propsPanel}>
            <Collapsible.Content>{panel}</Collapsible.Content>
          </Collapsible.Panel>
        </Collapsible.Root>
      </RemounterRoot>
    </Component>
  );
};
