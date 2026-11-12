import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  collapsedSelection,
  List,
  Symbol,
  TabBar,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfBell,
  sfClock,
  sfClockFill,
  sfHeart,
  sfHeartFill,
  sfMagnifyingglass,
  sfPersonCropCircle,
  sfPersonCropCircleFill,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { propOptionsContent, propOptionsRoot } from './props.js';

/**
 * A badge: a count in a capsule (a
 * circle for a digit), or a dot; on a symbol (a `Symbol`'s child: of a
 * button, of tabs), or inline (e.g. a list row's detail).
 */
export const BadgeDemo: FunctionComponent = () => {
  const id = 'badge';

  const [tab, setTab] = useState('favorites');
  // Collapsed, the active tab and its group remain (`collapsedSelection`'s).
  const [phone, search] = collapsedSelection(
    [['favorites', 'recents', 'contacts'], ['search']],
    tab,
  );

  const [externalRoot, externalContent] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    isOpen: true,
    title: 'root',
  });
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['emphasizedIcon', 'icon'],
          'Button.Icon': [],
          'Button.Root': ['aria-label', 'onClick', 'shape', 'size', 'variant'],
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['style'],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
          'TabBar.Group': ['visibleWhenCollapsed'],
          'TabBar.Icon': [],
          'TabBar.Indicator': [],
          'TabBar.Label': [],
          'TabBar.List': ['collapsed'],
          'TabBar.Root': ['onValueChange', 'value'],
          'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      controls={[controlRoot, controlContent, partControls]}
      id={id}
      state={[stateRoot, stateContent, partState]}
      title="Badge"
    >
      <div className="badge-demo-stage">
        <Button.Root
          {...partProps['Button.Root']}
          aria-label="Notifications"
          shape="circle"
          size="large"
          variant="glass"
          onClick={() => undefined}
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfBell}
            >
              <Badge
                placement="symbol"
                {...propsRoot}
              />
            </Symbol>
          </Button.Icon>
        </Button.Root>
        {/* Badges on all tabs but Recents; collapsed, the others collapse
            away with their badges. */}
        <TabBar.Root
          {...partProps['TabBar.Root']}
          value={tab}
          onValueChange={(next: unknown) => setTab(next as string)}
        >
          <TabBar.List
            {...partProps['TabBar.List']}
            collapsed={propsContent.collapsed}
          >
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed={phone?.remains}
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="favorites"
                visibleWhenCollapsed={phone?.remains && phone.tab === 0}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    emphasizedIcon={sfHeartFill}
                    icon={sfHeart}
                  >
                    <Badge
                      placement="symbol"
                      {...propsRoot}
                    />
                  </Symbol>
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Favorites
                </TabBar.Label>
              </TabBar.Tab>
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="recents"
                visibleWhenCollapsed={phone?.remains && phone.tab === 1}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    emphasizedIcon={sfClockFill}
                    icon={sfClock}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Recents
                </TabBar.Label>
              </TabBar.Tab>
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="contacts"
                visibleWhenCollapsed={phone?.remains && phone.tab === 2}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    emphasizedIcon={sfPersonCropCircleFill}
                    icon={sfPersonCropCircle}
                  >
                    <Badge
                      placement="symbol"
                      {...propsRoot}
                    />
                  </Symbol>
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Contacts
                </TabBar.Label>
              </TabBar.Tab>
            </TabBar.Group>
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                aria-label="Search"
                value="search"
                visibleWhenCollapsed={search?.remains}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfMagnifyingglass}
                  >
                    <Badge
                      placement="symbol"
                      {...propsRoot}
                    />
                  </Symbol>
                </TabBar.Icon>
              </TabBar.Tab>
            </TabBar.Group>
          </TabBar.List>
        </TabBar.Root>
        <List.Root
          {...partProps['List.Root']}
          style={{ width: '100%' }}
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Inbox</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>
                    <Badge
                      {...propsRoot}
                      placement="inline"
                    />
                  </List.Detail>
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};
