import { sfBell } from '@bradleyhodges/sfsymbols/sfBell';
import { sfClock } from '@bradleyhodges/sfsymbols/sfClock';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPersonCropCircle } from '@bradleyhodges/sfsymbols/sfPersonCropCircle';
import { FunctionComponent, useState } from 'react';

import {
  Badge,
  Button,
  collapsedSelection,
  List,
  TabBar,
} from '../../components/index.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import { propOptionsContent, propOptionsRoot } from './props.js';

type Symbol = Parameters<typeof SFSymbol>[0]['icon'];

// The tab bar's groups of tabs (badged, or not).
const tabGroups: {
  badge: boolean;
  label: string;
  symbol: Symbol;
  value: string;
}[][] = [
  [
    {
      badge: true,
      label: 'Favorites',
      symbol: sfHeartFill,
      value: 'favorites',
    },
    { badge: false, label: 'Recents', symbol: sfClock, value: 'recents' },
    {
      badge: true,
      label: 'Contacts',
      symbol: sfPersonCropCircle,
      value: 'contacts',
    },
  ],
  [
    {
      badge: true,
      label: 'Search',
      symbol: sfMagnifyingglass,
      value: 'search',
    },
  ],
];

/**
 * A badge (UIKit `badgeValue`, Figma “_Badge”): a count in a capsule (a
 * circle for a digit), or a dot; on the corner of a button, of a tab's
 * symbol, or inline (e.g. a list row's detail).
 */
export const BadgeDemo: FunctionComponent = () => {
  const id = 'badge';

  const [tab, setTab] = useState('favorites');
  const selection = collapsedSelection(
    tabGroups.map((tabs) => tabs.map(({ value }) => value)),
    tab,
  );

  const [externalRoot, externalContent] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      controls={[controlRoot, controlContent]}
      id={id}
      stateUrl={useCreateStateUrl(id, [stateRoot, stateContent])}
      title="Badge"
    >
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          gap: 32,
          justifyItems: 'center',
          paddingBlock: 16,
          width: 'min(402px, 100%)',
        }}
      >
        <Button.Root
          aria-label="Notifications"
          shape="circle"
          size="large"
          variant="glass"
          onClick={() => undefined}
        >
          <Button.Symbol>
            <SFSymbol icon={sfBell} />
          </Button.Symbol>
          <Badge {...propsRoot} />
        </Button.Root>
        {/* Badges on all tabs but Recents; collapsed, the active tab and
            its group remain (as iOS), the others collapsing away with
            their badges. */}
        <TabBar.Root
          value={tab}
          onValueChange={(next: unknown) => setTab(next as string)}
        >
          <TabBar.List collapsed={propsContent.collapsed}>
            {tabGroups.map((tabs, group) => (
              <TabBar.Group
                key={tabs[0]?.value}
                visibleWhenCollapsed={selection[group]?.remains}
              >
                <TabBar.Indicator />
                {tabs.map(({ badge, label, symbol, value }, index) => (
                  <TabBar.Tab
                    key={value}
                    aria-label={tabs.length > 1 ? undefined : label}
                    value={value}
                    visibleWhenCollapsed={
                      selection[group]?.remains &&
                      selection[group].tab === index
                    }
                  >
                    <TabBar.Icon>
                      <SFSymbol icon={symbol} />
                    </TabBar.Icon>
                    {tabs.length > 1 ? (
                      <TabBar.Label>{label}</TabBar.Label>
                    ) : null}
                    {badge ? <Badge {...propsRoot} /> : null}
                  </TabBar.Tab>
                ))}
              </TabBar.Group>
            ))}
          </TabBar.List>
        </TabBar.Root>
        <List.Root style={{ width: '100%' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>Inbox</List.Title>
                <List.Detail>
                  <Badge
                    {...propsRoot}
                    placement="inline"
                  />
                </List.Detail>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};
