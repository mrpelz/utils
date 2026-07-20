import { FunctionComponent } from 'preact';

import { Collapsible } from '../components/index.js';
import { Component } from './utils/main.js';

export const CollapsibleDemo: FunctionComponent = () => (
  <Component
    id="collapsible"
    title="Collapsible"
  >
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
  </Component>
);
