import './style.css';

import { sfBell } from '@bradleyhodges/sfsymbols/sfBell';
import { sfClock } from '@bradleyhodges/sfsymbols/sfClock';
import { sfClockFill } from '@bradleyhodges/sfsymbols/sfClockFill';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPersonCropCircle } from '@bradleyhodges/sfsymbols/sfPersonCropCircle';
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { FunctionComponent, useState } from 'react';

import {
  Badge,
  Button,
  collapsedSelection,
  List,
  Symbol,
  TabBar,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { propOptionsContent, propOptionsRoot } from './props.js';

/**
 * A badge (UIKit `badgeValue`, Figma “_Badge”): a count in a capsule (a
 * circle for a digit), or a dot; on a symbol (a `Symbol`'s child: of a
 * button, of tabs), or inline (e.g. a list row's detail).
 */
export const BadgeDemo: FunctionComponent = () => {
  const id = 'badge';

  const [tab, setTab] = useState('favorites');
  // Collapsed, the active tab and its group remain (as iOS's).
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

  return (
    <Component
      isCentered
      controls={[controlRoot, controlContent]}
      id={id}
      state={[stateRoot, stateContent]}
      title="Badge"
    >
      <div className="badge-demo-stage">
        <Button.Root
          aria-label="Notifications"
          shape="circle"
          size="large"
          variant="glass"
          onClick={() => undefined}
        >
          <Button.Icon>
            <Symbol icon={sfBell}>
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
          value={tab}
          onValueChange={(next: unknown) => setTab(next as string)}
        >
          <TabBar.List collapsed={propsContent.collapsed}>
            <TabBar.Group visibleWhenCollapsed={phone?.remains}>
              <TabBar.Indicator />
              <TabBar.Tab
                value="favorites"
                visibleWhenCollapsed={phone?.remains && phone.tab === 0}
              >
                <TabBar.Icon>
                  <Symbol
                    emphasizedIcon={sfHeartFill}
                    icon={sfHeart}
                  >
                    <Badge
                      placement="symbol"
                      {...propsRoot}
                    />
                  </Symbol>
                </TabBar.Icon>
                <TabBar.Label>Favorites</TabBar.Label>
              </TabBar.Tab>
              <TabBar.Tab
                value="recents"
                visibleWhenCollapsed={phone?.remains && phone.tab === 1}
              >
                <TabBar.Icon>
                  <Symbol
                    emphasizedIcon={sfClockFill}
                    icon={sfClock}
                  />
                </TabBar.Icon>
                <TabBar.Label>Recents</TabBar.Label>
              </TabBar.Tab>
              <TabBar.Tab
                value="contacts"
                visibleWhenCollapsed={phone?.remains && phone.tab === 2}
              >
                <TabBar.Icon>
                  <Symbol
                    emphasizedIcon={sfPersonCropCircleFill}
                    icon={sfPersonCropCircle}
                  >
                    <Badge
                      placement="symbol"
                      {...propsRoot}
                    />
                  </Symbol>
                </TabBar.Icon>
                <TabBar.Label>Contacts</TabBar.Label>
              </TabBar.Tab>
            </TabBar.Group>
            <TabBar.Group visibleWhenCollapsed={search?.remains}>
              <TabBar.Indicator />
              <TabBar.Tab
                aria-label="Search"
                value="search"
                visibleWhenCollapsed={search?.remains}
              >
                <TabBar.Icon>
                  <Symbol icon={sfMagnifyingglass}>
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
