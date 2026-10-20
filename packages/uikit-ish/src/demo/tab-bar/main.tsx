import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  collapsedSelection,
  Symbol,
  TabBar,
  useViewportScroll,
  Viewport,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsTab,
  propOptionsAccessoryContent,
  propOptionsContent,
  propOptionsGroup,
  propOptionsList,
  propOptionsListRegular,
  propOptionsRoot,
} from './props.js';

// The tab bars' tabs: `heart.fill` and a label (Figma: `star.fill`, not in
// the symbols' catalogue), `tab-1` and on; search (`secondary-1`) in a group
// of its own. What remains while collapsed is the app's (here, the demo's):
// the tabs and groups marked by their controls, if any are; otherwise as
// iOS (`collapsedSelection`): the active tab and its group.

/**
 * A tab bar (UIKit `UITabBar`, Figma “Tab Bar - iPhone”): a glass capsule of
 * tabs, the selection sliding between them, a lens under the pointer;
 * collapsed (the list's control), the active tab remains, and a click on
 * the group expands the bar again.
 */
export const TabBarDemo: FunctionComponent = () => {
  const id = 'tab-bar';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalList,
    externalGroup,
    externalTab1,
    externalTab2,
    externalTab3,
  ] = useProvidedState(id);

  const [value, setValue] = useState<unknown>('tab-1');
  const [collapsed, setCollapsed] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'TabBar.Root',
    externalRoot,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'TabBar.Group',
    externalGroup,
  );
  const tabOptions = useMemo(() => getPropOptionsTab(addLog), [addLog]);
  const [controlTab1, propsTab1, stateTab1] = usePropControl(
    tabOptions,
    'TabBar.Tab (1st)',
    externalTab1,
  );
  const [controlTab2, propsTab2, stateTab2] = usePropControl(
    tabOptions,
    'TabBar.Tab (2nd)',
    externalTab2,
  );
  const [controlTab3, propsTab3, stateTab3] = usePropControl(
    tabOptions,
    'TabBar.Tab (3rd)',
    externalTab3,
  );

  // What remains while collapsed (see above).
  const [selection] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5']],
    value,
  );
  const tabsMarked = [propsTab1, propsTab2, propsTab3].some(
    (props) => props.visibleWhenCollapsed,
  );

  return (
    <Component
      center
      baseUiId="tabs"
      id={id}
      log={log}
      title="Tab Bar"
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlGroup,
        controlTab1,
        controlTab2,
        controlTab3,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateList,
        stateGroup,
        stateTab1,
        stateTab2,
        stateTab3,
      ]}
    >
      <TabBar.Root
        {...propsRoot}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
        }}
      >
        <TabBar.List
          {...propsList}
          collapsed={propsList.collapsed ?? collapsed}
        >
          {/* A click on the collapsed group expands the bar. */}
          <TabBar.Group
            onClickCapture={() => setCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={propsGroup.visibleWhenCollapsed ?? true}
          >
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                tabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : selection?.tab === 0
              }
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              {...propsTab2}
              visibleWhenCollapsed={
                tabsMarked
                  ? Boolean(propsTab2.visibleWhenCollapsed)
                  : selection?.tab === 1
              }
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            {content.tabs >= 3 ? (
              <TabBar.Tab
                value="tab-3"
                {...propsTab3}
                visibleWhenCollapsed={
                  tabsMarked
                    ? Boolean(propsTab3.visibleWhenCollapsed)
                    : selection?.tab === 2
                }
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 4 ? (
              <TabBar.Tab
                value="tab-4"
                visibleWhenCollapsed={!tabsMarked && selection?.tab === 3}
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 5 ? (
              <TabBar.Tab
                value="tab-5"
                visibleWhenCollapsed={!tabsMarked && selection?.tab === 4}
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar with search in a group of its own (Figma “Tab Bar - iPhone”,
 * Search): the app (here, the demo) collapses the bar on search, a click
 * on a collapsed group expands it; the selection fades between groups.
 */
// eslint-disable-next-line complexity -- its tabs, written out
export const TabBarSearchDemo: FunctionComponent = () => {
  const id = 'tab-bar-search';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalList,
    externalGroup,
    externalTab1,
    externalTab2,
    externalTab3,
    externalSearchGroup,
    externalSearchTab,
  ] = useProvidedState(id);

  const [value, setValue] = useState<unknown>('tab-1');
  const [collapsed, setCollapsed] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'TabBar.Root',
    externalRoot,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'TabBar.Group',
    externalGroup,
  );
  const tabOptions = useMemo(() => getPropOptionsTab(addLog), [addLog]);
  const [controlTab1, propsTab1, stateTab1] = usePropControl(
    tabOptions,
    'TabBar.Tab (1st)',
    externalTab1,
  );
  const [controlTab2, propsTab2, stateTab2] = usePropControl(
    tabOptions,
    'TabBar.Tab (2nd)',
    externalTab2,
  );
  const [controlTab3, propsTab3, stateTab3] = usePropControl(
    tabOptions,
    'TabBar.Tab (3rd)',
    externalTab3,
  );
  const [controlSearchGroup, propsSearchGroup, stateSearchGroup] =
    usePropControl(
      propOptionsGroup,
      'TabBar.Group (search)',
      externalSearchGroup,
    );
  const [controlSearchTab, propsSearchTab, stateSearchTab] = usePropControl(
    tabOptions,
    'TabBar.Tab (search)',
    externalSearchTab,
  );

  // What remains while collapsed (see above).
  const [primary, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5'], ['secondary-1']],
    value,
  );
  const tabsMarked = [propsTab1, propsTab2, propsTab3].some(
    (props) => props.visibleWhenCollapsed,
  );
  const groupMarked = Boolean(propsGroup.visibleWhenCollapsed) || tabsMarked;
  const searchMarked = Boolean(
    propsSearchGroup.visibleWhenCollapsed ??
    propsSearchTab.visibleWhenCollapsed,
  );
  const anyMarked = groupMarked || searchMarked;
  const groupRemains = anyMarked ? groupMarked : Boolean(primary?.remains);
  const searchRemains = anyMarked ? searchMarked : Boolean(search?.remains);

  return (
    <Component
      center
      baseUiId="tabs"
      id={id}
      log={log}
      title="Tab Bar (Search)"
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlGroup,
        controlTab1,
        controlTab2,
        controlTab3,
        controlSearchGroup,
        controlSearchTab,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateList,
        stateGroup,
        stateTab1,
        stateTab2,
        stateTab3,
        stateSearchGroup,
        stateSearchTab,
      ]}
    >
      <TabBar.Root
        {...propsRoot}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
          // Search collapses the bar.
          if (next === 'secondary-1') setCollapsed(true);
        }}
      >
        <TabBar.List
          {...propsList}
          collapsed={propsList.collapsed ?? collapsed}
        >
          {/* A click on a collapsed group expands the bar. */}
          <TabBar.Group
            onClickCapture={() => setCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={groupRemains}
          >
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                tabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : primary?.tab === 0
              }
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              {...propsTab2}
              visibleWhenCollapsed={
                tabsMarked
                  ? Boolean(propsTab2.visibleWhenCollapsed)
                  : primary?.tab === 1
              }
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            {content.tabs >= 3 ? (
              <TabBar.Tab
                value="tab-3"
                {...propsTab3}
                visibleWhenCollapsed={
                  tabsMarked
                    ? Boolean(propsTab3.visibleWhenCollapsed)
                    : primary?.tab === 2
                }
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 4 ? (
              <TabBar.Tab
                value="tab-4"
                visibleWhenCollapsed={!tabsMarked && primary?.tab === 3}
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 5 ? (
              <TabBar.Tab
                value="tab-5"
                visibleWhenCollapsed={!tabsMarked && primary?.tab === 4}
              >
                <TabBar.Icon>
                  <Symbol icon={sfHeartFill} />
                </TabBar.Icon>
                <TabBar.Label>Label</TabBar.Label>
              </TabBar.Tab>
            ) : null}
          </TabBar.Group>
          <TabBar.Group
            onClickCapture={() => setCollapsed(false)}
            {...propsSearchGroup}
            visibleWhenCollapsed={searchRemains}
          >
            <TabBar.Indicator />
            <TabBar.Tab
              aria-label="Search"
              value="secondary-1"
              {...propsSearchTab}
              visibleWhenCollapsed={searchRemains}
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar's accessory (UIKit `bottomAccessory`, e.g. Music's mini player):
 * above the groups, collapsed between them; in either state, or both
 * (morphing between its places).
 */
export const TabBarAccessoryDemo: FunctionComponent = () => {
  const id = 'tab-bar-accessory';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalList,
    externalGroup,
    externalSearchGroup,
  ] = useProvidedState(id);

  const [value, setValue] = useState<unknown>('tab-1');

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAccessoryContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'TabBar.Root',
    externalRoot,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'TabBar.Group',
    externalGroup,
  );
  const [controlSearchGroup, propsSearchGroup, stateSearchGroup] =
    usePropControl(
      propOptionsGroup,
      'TabBar.Group (search)',
      externalSearchGroup,
    );

  // What remains while collapsed (see above).
  const [primary, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3'], ['secondary-1']],
    value,
  );
  const anyMarked = Boolean(
    propsGroup.visibleWhenCollapsed ?? propsSearchGroup.visibleWhenCollapsed,
  );

  return (
    <Component
      center
      baseUiId="tabs"
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateList, stateGroup, stateSearchGroup]}
      title="Tab Bar (Accessory)"
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlGroup,
        controlSearchGroup,
      ]}
    >
      <TabBar.Root
        {...propsRoot}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
        }}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group
            {...propsGroup}
            visibleWhenCollapsed={
              anyMarked
                ? Boolean(propsGroup.visibleWhenCollapsed)
                : primary?.remains
            }
          >
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              visibleWhenCollapsed={primary?.tab === 0}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              visibleWhenCollapsed={primary?.tab === 1}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-3"
              visibleWhenCollapsed={primary?.tab === 2}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
          </TabBar.Group>
          <TabBar.Group
            {...propsSearchGroup}
            visibleWhenCollapsed={
              anyMarked
                ? Boolean(propsSearchGroup.visibleWhenCollapsed)
                : search?.remains
            }
          >
            <TabBar.Indicator />
            <TabBar.Tab
              aria-label="Search"
              value="secondary-1"
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
        {content.accessory ? (
          <TabBar.Accessory visibleIn={content.accessory}>
            <span className="tab-bar-demo-accessory-title">Not Playing</span>
            <Symbol icon={sfPlayFill} />
            <Symbol icon={sfForwardFill} />
          </TabBar.Accessory>
        ) : null}
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar collapsing as the page scrolls down (as iOS's), expanding as it
 * scrolls up (`useViewportScroll`): inside the viewport's provider (see
 * `TabBarScrollDemo`), so its code is the bar's own.
 */
const ScrollDemo: FunctionComponent = () => {
  const id = 'tab-bar-scroll';

  const [log, addLog] = useLog();
  const [value, setValue] = useState<unknown>('tab-1');
  const [collapsed, setCollapsed] = useState(false);

  useViewportScroll(({ atTop, direction }) =>
    setCollapsed(!atTop && direction === 'down'),
  );

  const [selection] = collapsedSelection([['tab-1', 'tab-2', 'tab-3']], value);

  return (
    <Component
      center
      baseUiId="tabs"
      id={id}
      log={log}
      title="Tab Bar (Collapsing on Scroll)"
    >
      <TabBar.Root
        value={value}
        onValueChange={(next: unknown) => {
          addLog(`value change: ${String(next)}`);
          setValue(next);
        }}
      >
        <TabBar.List collapsed={collapsed}>
          <TabBar.Group visibleWhenCollapsed>
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              visibleWhenCollapsed={selection?.tab === 0}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              visibleWhenCollapsed={selection?.tab === 1}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-3"
              visibleWhenCollapsed={selection?.tab === 2}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/** `ScrollDemo`, tracking the document's scrolling. */
export const TabBarScrollDemo: FunctionComponent = () => (
  <Viewport.Provider>
    <ScrollDemo />
  </Viewport.Provider>
);

/**
 * The iPad's tab bar (Figma “Tab Bar - iPad”, the list's `size` regular): a
 * single group whose tabs only have labels, between a sidebar and a search
 * tab that only have symbols.
 */
// eslint-disable-next-line complexity -- its tabs, written out
export const TabBarRegularDemo: FunctionComponent = () => {
  const id = 'tab-bar-regular';

  const [log, addLog] = useLog();
  // (Its list's control third, as the other tab bars'.)
  const [externalRoot, externalGroup, externalList, externalTab1] =
    useProvidedState(id);

  const [value, setValue] = useState<unknown>('tab-2');
  const [collapsed, setCollapsed] = useState(false);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'TabBar.Root',
    externalRoot,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsListRegular,
    'TabBar.List',
    externalList,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'TabBar.Group',
    externalGroup,
  );
  const [controlTab1, propsTab1, stateTab1] = usePropControl(
    useMemo(() => getPropOptionsTab(addLog), [addLog]),
    'TabBar.Tab (1st, sidebar)',
    externalTab1,
  );

  // What remains while collapsed (see above).
  const [selection] = collapsedSelection(
    [Array.from({ length: 9 }, (_, index) => `tab-${index + 1}`)],
    value,
  );
  const tabsMarked = Boolean(propsTab1.visibleWhenCollapsed);

  return (
    <Component
      center
      baseUiId="tabs"
      controls={[controlRoot, controlGroup, controlList, controlTab1]}
      id={id}
      log={log}
      state={[stateRoot, stateGroup, stateList, stateTab1]}
      title="Tab Bar (iPad)"
    >
      <TabBar.Root
        {...propsRoot}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
        }}
      >
        <TabBar.List
          {...propsList}
          collapsed={propsList.collapsed ?? collapsed}
        >
          <TabBar.Group
            onClickCapture={() => setCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={propsGroup.visibleWhenCollapsed ?? true}
          >
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                tabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : selection?.tab === 0
              }
            >
              <TabBar.Icon>
                <Symbol icon={sfListBullet} />
              </TabBar.Icon>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 1}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-3"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 2}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-4"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 3}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-5"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 4}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-6"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 5}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-7"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 6}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-8"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 7}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-9"
              visibleWhenCollapsed={!tabsMarked && selection?.tab === 8}
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/** Tabs of different sizes: the third only a symbol (a circle). */
export const TabBarMixedDemo: FunctionComponent = () => {
  const id = 'tab-bar-mixed';

  const [log, addLog] = useLog();

  return (
    <Component
      center
      baseUiId="tabs"
      id={id}
      log={log}
      title="Tab Bar (Mixed Tabs)"
    >
      <TabBar.Root
        defaultValue="tab-1"
        onValueChange={(next: unknown) =>
          addLog(`value change: ${String(next)}`)
        }
      >
        <TabBar.List>
          <TabBar.Group>
            <TabBar.Indicator />
            <TabBar.Tab value="tab-1">
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab value="tab-2">
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              aria-label="Favorites"
              value="tab-3"
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * Tabs of each content: a label only, a symbol and a label, a symbol only
 * (and search). Collapsed, the active tab remains, showing what it has (a
 * tab never collapses to nothing): a label-only tab its label, in a
 * capsule.
 */
export const TabBarContentDemo: FunctionComponent = () => {
  const id = 'tab-bar-content';

  const [log, addLog] = useLog();
  const [externalList] = useProvidedState(id);

  const [value, setValue] = useState<unknown>('tab-1');

  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
    true,
  );

  // What remains while collapsed: the active tab and its group.
  const [selection, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3'], ['secondary-1']],
    value,
  );

  return (
    <Component
      center
      baseUiId="tabs"
      controls={controlList}
      id={id}
      log={log}
      state={[stateList]}
      title="Tab Bar (Tab Content)"
    >
      <TabBar.Root
        value={value}
        onValueChange={(next: unknown) => {
          addLog(`value change: ${String(next)}`);
          setValue(next);
        }}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group visibleWhenCollapsed={selection?.remains}>
            <TabBar.Indicator />
            <TabBar.Tab
              value="tab-1"
              visibleWhenCollapsed={selection?.tab === 0}
            >
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              visibleWhenCollapsed={selection?.tab === 1}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
              <TabBar.Label>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              aria-label="Favorites"
              value="tab-3"
              visibleWhenCollapsed={selection?.tab === 2}
            >
              <TabBar.Icon>
                <Symbol icon={sfHeartFill} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
          <TabBar.Group visibleWhenCollapsed={search?.remains}>
            <TabBar.Indicator />
            <TabBar.Tab
              aria-label="Search"
              value="secondary-1"
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};
