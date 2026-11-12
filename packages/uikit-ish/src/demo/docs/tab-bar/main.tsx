import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  collapsedSelection,
  Symbol,
  TabBar,
  useViewportScroll,
  Viewport,
} from '../../../components/index.js';
import { CodeAroundContext, Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfForwardFill,
  sfHeartFill,
  sfListBullet,
  sfMagnifyingglass,
  sfPlayFill,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsTab,
  propOptionsAccessoryContent,
  propOptionsContent,
  propOptionsGroup,
  propOptionsList,
  propOptionsListRegular,
  propOptionsRoot,
} from './props.js';

// The tab bars' tabs: `heart.fill` and a label, `tab-1` and on; search (`secondary-1`) in a group
// of its own. What remains while collapsed is the app's (here, the demo's):
// the tabs and groups marked by their controls, if any are; otherwise
// `collapsedSelection`'s: the active tab and its group.

/**
 * A tab bar (compact): a glass capsule of
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'TabBar.Root',
  });
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    isOpen: true,
    title: 'TabBar.List',
  });
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, title: 'TabBar.Group' },
  );
  const tabOptions = useMemo(() => getPropOptionsTab(addLog), [addLog]);
  const [controlTab1, propsTab1, stateTab1] = usePropControl(tabOptions, {
    external: externalTab1,
    title: 'TabBar.Tab (1st)',
  });
  const [controlTab2, propsTab2, stateTab2] = usePropControl(tabOptions, {
    external: externalTab2,
    title: 'TabBar.Tab (2nd)',
  });
  const [controlTab3, propsTab3, stateTab3] = usePropControl(tabOptions, {
    external: externalTab3,
    title: 'TabBar.Tab (3rd)',
  });

  // What remains while collapsed (see above).
  const [selection] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5']],
    value,
  );
  const areTabsMarked = [propsTab1, propsTab2, propsTab3].some(
    (props) => props.visibleWhenCollapsed,
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'TabBar.Tab': ['value', 'visibleWhenCollapsed'],
            Symbol: ['icon'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
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
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateList,
        stateGroup,
        stateTab1,
        stateTab2,
        stateTab3,
        partState,
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
          collapsed={propsList.collapsed ?? isCollapsed}
        >
          {/* A click on the collapsed group expands the bar. */}
          <TabBar.Group
            onClickCapture={() => setIsCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={propsGroup.visibleWhenCollapsed ?? true}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                areTabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : selection?.tab === 0
              }
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              {...propsTab2}
              visibleWhenCollapsed={
                areTabsMarked
                  ? Boolean(propsTab2.visibleWhenCollapsed)
                  : selection?.tab === 1
              }
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            {content.tabs >= 3 ? (
              <TabBar.Tab
                value="tab-3"
                {...propsTab3}
                visibleWhenCollapsed={
                  areTabsMarked
                    ? Boolean(propsTab3.visibleWhenCollapsed)
                    : selection?.tab === 2
                }
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 4 ? (
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="tab-4"
                visibleWhenCollapsed={!areTabsMarked && selection?.tab === 3}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 5 ? (
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="tab-5"
                visibleWhenCollapsed={!areTabsMarked && selection?.tab === 4}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar with search in a group of its own: the app (here, the demo) collapses the bar on search, a click
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'TabBar.Root',
  });
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    isOpen: true,
    title: 'TabBar.List',
  });
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, title: 'TabBar.Group' },
  );
  const tabOptions = useMemo(() => getPropOptionsTab(addLog), [addLog]);
  const [controlTab1, propsTab1, stateTab1] = usePropControl(tabOptions, {
    external: externalTab1,
    title: 'TabBar.Tab (1st)',
  });
  const [controlTab2, propsTab2, stateTab2] = usePropControl(tabOptions, {
    external: externalTab2,
    title: 'TabBar.Tab (2nd)',
  });
  const [controlTab3, propsTab3, stateTab3] = usePropControl(tabOptions, {
    external: externalTab3,
    title: 'TabBar.Tab (3rd)',
  });
  const [controlSearchGroup, propsSearchGroup, stateSearchGroup] =
    usePropControl(propOptionsGroup, {
      external: externalSearchGroup,
      title: 'TabBar.Group (search)',
    });
  const [controlSearchTab, propsSearchTab, stateSearchTab] = usePropControl(
    tabOptions,
    { external: externalSearchTab, title: 'TabBar.Tab (search)' },
  );

  // What remains while collapsed (see above).
  const [primary, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5'], ['secondary-1']],
    value,
  );
  const areTabsMarked = [propsTab1, propsTab2, propsTab3].some(
    (props) => props.visibleWhenCollapsed,
  );
  const isGroupMarked =
    Boolean(propsGroup.visibleWhenCollapsed) || areTabsMarked;
  const isSearchMarked = Boolean(
    propsSearchGroup.visibleWhenCollapsed ??
    propsSearchTab.visibleWhenCollapsed,
  );
  const isAnyMarked = isGroupMarked || isSearchMarked;
  const isGroupRemaining = isAnyMarked
    ? isGroupMarked
    : Boolean(primary?.remains);
  const isSearchRemaining = isAnyMarked
    ? isSearchMarked
    : Boolean(search?.remains);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'TabBar.Tab': ['value', 'visibleWhenCollapsed'],
            Symbol: ['icon'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
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
        partControls,
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
        partState,
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
          if (next === 'secondary-1') setIsCollapsed(true);
        }}
      >
        <TabBar.List
          {...propsList}
          collapsed={propsList.collapsed ?? isCollapsed}
        >
          {/* A click on a collapsed group expands the bar. */}
          <TabBar.Group
            onClickCapture={() => setIsCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={isGroupRemaining}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                areTabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : primary?.tab === 0
              }
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              value="tab-2"
              {...propsTab2}
              visibleWhenCollapsed={
                areTabsMarked
                  ? Boolean(propsTab2.visibleWhenCollapsed)
                  : primary?.tab === 1
              }
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            {content.tabs >= 3 ? (
              <TabBar.Tab
                value="tab-3"
                {...propsTab3}
                visibleWhenCollapsed={
                  areTabsMarked
                    ? Boolean(propsTab3.visibleWhenCollapsed)
                    : primary?.tab === 2
                }
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 4 ? (
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="tab-4"
                visibleWhenCollapsed={!areTabsMarked && primary?.tab === 3}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
            {content.tabs >= 5 ? (
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                value="tab-5"
                visibleWhenCollapsed={!areTabsMarked && primary?.tab === 4}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </TabBar.Icon>
                <TabBar.Label {...partProps['TabBar.Label']}>
                  Label
                </TabBar.Label>
              </TabBar.Tab>
            ) : null}
          </TabBar.Group>
          <TabBar.Group
            onClickCapture={() => setIsCollapsed(false)}
            {...propsSearchGroup}
            visibleWhenCollapsed={isSearchRemaining}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              aria-label="Search"
              value="secondary-1"
              {...propsSearchTab}
              visibleWhenCollapsed={isSearchRemaining}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfMagnifyingglass}
                />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar's accessory (e.g. a music app's mini player):
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
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'TabBar.Root',
  });
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    isOpen: true,
    title: 'TabBar.List',
  });
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, title: 'TabBar.Group' },
  );
  const [controlSearchGroup, propsSearchGroup, stateSearchGroup] =
    usePropControl(propOptionsGroup, {
      external: externalSearchGroup,
      title: 'TabBar.Group (search)',
    });

  // What remains while collapsed (see above).
  const [primary, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3'], ['secondary-1']],
    value,
  );
  const isAnyMarked = Boolean(
    propsGroup.visibleWhenCollapsed ?? propsSearchGroup.visibleWhenCollapsed,
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Accessory': ['visibleIn'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
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
      baseUiId="tabs"
      id={id}
      log={log}
      title="Tab Bar (Accessory)"
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlGroup,
        controlSearchGroup,
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateList,
        stateGroup,
        stateSearchGroup,
        partState,
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
              isAnyMarked
                ? Boolean(propsGroup.visibleWhenCollapsed)
                : primary?.remains
            }
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-1"
              visibleWhenCollapsed={primary?.tab === 0}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-2"
              visibleWhenCollapsed={primary?.tab === 1}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-3"
              visibleWhenCollapsed={primary?.tab === 2}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
          </TabBar.Group>
          <TabBar.Group
            {...propsSearchGroup}
            visibleWhenCollapsed={
              isAnyMarked
                ? Boolean(propsSearchGroup.visibleWhenCollapsed)
                : search?.remains
            }
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              aria-label="Search"
              value="secondary-1"
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfMagnifyingglass}
                />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
        {content.accessory ? (
          <TabBar.Accessory
            {...partProps['TabBar.Accessory']}
            visibleIn={content.accessory}
          >
            <span className="tab-bar-demo-accessory-title">Not Playing</span>
            <Symbol
              {...partProps.Symbol}
              icon={sfPlayFill}
            />
            <Symbol
              {...partProps.Symbol}
              icon={sfForwardFill}
            />
          </TabBar.Accessory>
        ) : null}
      </TabBar.Root>
    </Component>
  );
};

/**
 * A tab bar collapsing as the page scrolls down, expanding as it
 * scrolls up (`useViewportScroll`): inside the viewport's provider (see
 * `TabBarScrollDemo`), so its code is the bar's own.
 */
const ScrollDemo: FunctionComponent = () => {
  const id = 'tab-bar-scroll';

  const [log, addLog] = useLog();
  const [value, setValue] = useState<unknown>('tab-1');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useViewportScroll(({ atTop, direction }) =>
    setIsCollapsed(!atTop && direction === 'down'),
  );

  const [selection] = collapsedSelection([['tab-1', 'tab-2', 'tab-3']], value);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': ['collapsed'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['value', 'visibleWhenCollapsed'],
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
      baseUiId="tabs"
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Tab Bar (Collapsing on Scroll)"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={(next: unknown) => {
          addLog(`value change: ${String(next)}`);
          setValue(next);
        }}
      >
        <TabBar.List
          {...partProps['TabBar.List']}
          collapsed={isCollapsed}
        >
          <TabBar.Group
            {...partProps['TabBar.Group']}
            visibleWhenCollapsed
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-1"
              visibleWhenCollapsed={selection?.tab === 0}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-2"
              visibleWhenCollapsed={selection?.tab === 1}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-3"
              visibleWhenCollapsed={selection?.tab === 2}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/** `ScrollDemo`, tracking the document's scrolling. */
// (In the code: the provider around the stage's.)
const plainProvider = <Viewport.Provider />;

export const TabBarScrollDemo: FunctionComponent = () => (
  <Viewport.Provider>
    <CodeAroundContext.Provider value={plainProvider}>
      <ScrollDemo />
    </CodeAroundContext.Provider>
  </Viewport.Provider>
);

/**
 * The regular tab bar (the list's `size` regular): a
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'TabBar.Root',
  });
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsListRegular,
    { external: externalList, isOpen: true, title: 'TabBar.List' },
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, title: 'TabBar.Group' },
  );
  const [controlTab1, propsTab1, stateTab1] = usePropControl(
    useMemo(() => getPropOptionsTab(addLog), [addLog]),
    { external: externalTab1, title: 'TabBar.Tab (1st, sidebar)' },
  );

  // What remains while collapsed (see above).
  const [selection] = collapsedSelection(
    [Array.from({ length: 9 }, (_, index) => `tab-${index + 1}`)],
    value,
  );
  const areTabsMarked = Boolean(propsTab1.visibleWhenCollapsed);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'TabBar.Tab': ['value', 'visibleWhenCollapsed'],
            Symbol: ['icon'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
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
      baseUiId="tabs"
      id={id}
      log={log}
      state={[stateRoot, stateGroup, stateList, stateTab1, partState]}
      title="Tab Bar (regular)"
      controls={[
        controlRoot,
        controlGroup,
        controlList,
        controlTab1,
        partControls,
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
          collapsed={propsList.collapsed ?? isCollapsed}
        >
          <TabBar.Group
            onClickCapture={() => setIsCollapsed(false)}
            {...propsGroup}
            visibleWhenCollapsed={propsGroup.visibleWhenCollapsed ?? true}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              value="tab-1"
              {...propsTab1}
              visibleWhenCollapsed={
                areTabsMarked
                  ? Boolean(propsTab1.visibleWhenCollapsed)
                  : selection?.tab === 0
              }
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfListBullet}
                />
              </TabBar.Icon>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-2"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 1}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-3"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 2}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-4"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 3}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-5"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 4}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-6"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 5}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-7"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 6}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-8"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 7}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-9"
              visibleWhenCollapsed={!areTabsMarked && selection?.tab === 8}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfMagnifyingglass}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Root': ['defaultValue', 'onValueChange'],
            'TabBar.Tab': ['aria-label', 'value'],
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
      baseUiId="tabs"
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Tab Bar (Mixed Tabs)"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        defaultValue="tab-1"
        onValueChange={(next: unknown) =>
          addLog(`value change: ${String(next)}`)
        }
      >
        <TabBar.List {...partProps['TabBar.List']}>
          <TabBar.Group {...partProps['TabBar.Group']}>
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-1"
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-2"
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              aria-label="Favorites"
              value="tab-3"
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
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

  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    isOpen: true,
    title: 'TabBar.List',
  });

  // What remains while collapsed: the active tab and its group.
  const [selection, search] = collapsedSelection(
    [['tab-1', 'tab-2', 'tab-3'], ['secondary-1']],
    value,
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
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
      baseUiId="tabs"
      controls={[controlList, partControls]}
      id={id}
      log={log}
      state={[stateList, partState]}
      title="Tab Bar (Tab Content)"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={(next: unknown) => {
          addLog(`value change: ${String(next)}`);
          setValue(next);
        }}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group
            {...partProps['TabBar.Group']}
            visibleWhenCollapsed={selection?.remains}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-1"
              visibleWhenCollapsed={selection?.tab === 0}
            >
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              value="tab-2"
              visibleWhenCollapsed={selection?.tab === 1}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
              <TabBar.Label {...partProps['TabBar.Label']}>Label</TabBar.Label>
            </TabBar.Tab>
            <TabBar.Tab
              {...partProps['TabBar.Tab']}
              aria-label="Favorites"
              value="tab-3"
              visibleWhenCollapsed={selection?.tab === 2}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
              </TabBar.Icon>
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
              value="secondary-1"
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Icon {...partProps['TabBar.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfMagnifyingglass}
                />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};
