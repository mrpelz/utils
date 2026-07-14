import { FunctionComponent } from 'preact';

import { Collapsible } from '../components/index.js';
import { ComponentEntry, Story } from './utils.js';

const Simple: FunctionComponent = () => (
  <Story title="Simple">
    <Collapsible.Root>
      <Collapsible.Trigger>
        Notifications
        <Collapsible.Icon />
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <Collapsible.Content>
          <div>You are all caught up.</div>
          <div>No new notifications at this time.</div>
        </Collapsible.Content>
      </Collapsible.Panel>
    </Collapsible.Root>
  </Story>
);

const DefaultOpen: FunctionComponent = () => (
  <Story title="Default Open">
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger>
        Notifications
        <Collapsible.Icon />
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <Collapsible.Content>
          <div>You are all caught up.</div>
          <div>No new notifications at this time.</div>
        </Collapsible.Content>
      </Collapsible.Panel>
    </Collapsible.Root>
  </Story>
);

const MaxWidth: FunctionComponent = () => (
  <Story title="Max Width">
    <Collapsible.Root styled-max-width="20rem">
      <Collapsible.Trigger>
        Notifications
        <Collapsible.Icon />
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <Collapsible.Content>
          <div>You are all caught up.</div>
          <div>No new notifications at this time.</div>
        </Collapsible.Content>
      </Collapsible.Panel>
    </Collapsible.Root>
  </Story>
);

export const CollapsibleDemo: FunctionComponent = () => (
  <ComponentEntry
    id="collapsible"
    name="Collapsible"
  >
    <Simple />
    <DefaultOpen />
    <MaxWidth />
  </ComponentEntry>
);
