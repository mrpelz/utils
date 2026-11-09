import { FunctionComponent, ReactNode, useState } from 'react';

import {
  Button,
  Header,
  List,
  Navigation,
  Page,
  Symbol,
  TabBar,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import {
  pages,
  sections,
  type SectionValue,
} from '../docs/navigation/content.js';
import { sfChevronBackward } from '../tooling/icons.js';
import { SinkSwipeAreas, usePop } from './shared.js';

// Navigation's apps (pages of their own, each its own stack, see
// structure.tsx): going back quickly, popping to the root from code (a
// persistent Done), a stack per tab. As the docs' compositions, at their
// root a button leaving the app (the kitchen sink's stack popped).

/** Leaving the app (its root's back): the kitchen sink's stack popped. */
const LeaveButton: FunctionComponent = () => {
  const pop = usePop();

  return (
    <Toolbar.Button
      aria-label="Back"
      shape="circle"
      onClick={pop}
    >
      <Button.Icon>
        <Symbol icon={sfChevronBackward} />
      </Button.Icon>
    </Toolbar.Button>
  );
};

/**
 * A stack's page: its bar (back, the title, `trailing`), its rows; at the
 * root (no `back`), leaving the app.
 */
const Level: FunctionComponent<{
  back?: string;
  children: ReactNode;
  footer?: ReactNode;
  title: string;
  trailing?: ReactNode;
}> = ({ back, children, footer, title, trailing }) => (
  <Header.Root>
    <Viewport.BlockStart>
      <Toolbar.Root placement="block-start">
        <Toolbar.Leading>
          {back === undefined ? (
            <LeaveButton />
          ) : (
            <Navigation.Back
              aria-label={back}
              render={<Toolbar.Button shape="circle" />}
            >
              <Button.Icon>
                <Symbol icon={sfChevronBackward} />
              </Button.Icon>
            </Navigation.Back>
          )}
        </Toolbar.Leading>
        <Toolbar.Title>
          <span>{title}</span>
        </Toolbar.Title>
        {trailing === undefined ? null : (
          <Toolbar.Trailing>{trailing}</Toolbar.Trailing>
        )}
      </Toolbar.Root>
    </Viewport.BlockStart>
    <Page.Root>
      <Viewport.Padding edge="block-start" />
      <List.Root>
        {children}
        {footer}
      </List.Root>
      <Viewport.Padding edge="block-end" />
    </Page.Root>
  </Header.Root>
);

/** A row drilling in (`onClick` pushing a page). */
const DrillItem: FunctionComponent<{
  onClick: () => void;
  title: string;
}> = ({ onClick, title }) => (
  <List.Item>
    <List.Content>
      <List.Title
        render={<button type="button" />}
        onClick={onClick}
      >
        {title}
      </List.Title>
    </List.Content>
    <List.Trailing>
      <List.DrillIn />
    </List.Trailing>
  </List.Item>
);

/**
 * Levels deep (eight, at first), pushing one or five more: going back
 * quickly, back pressed again (or swiped) while the last back still
 * slides (as the docs' "Going back quickly").
 */
export const QuickBackApp: FunctionComponent = () => {
  const [keys, setKeys] = useState(() =>
    Array.from({ length: 8 }, (_, index) => String(index + 1)),
  );
  const push = (count: number) =>
    setKeys((current) => [
      ...current,
      ...Array.from({ length: count }, (_, index) =>
        String(current.length + index + 1),
      ),
    ]);

  return (
    <Navigation.Root onBack={() => setKeys((current) => current.slice(0, -1))}>
      <SinkSwipeAreas />
      <Navigation.Stack>
        {keys.map((key, index) => (
          <Level
            key={key}
            back={index > 0 ? `Level ${keys[index - 1] ?? ''}` : undefined}
            title={`Level ${key}`}
            footer={
              <List.Footer>
                Press back (or swipe back) again while it still slides: each
                press goes a level further.
              </List.Footer>
            }
          >
            <List.Section>
              <List.Group>
                {[1, 5].map((count) => (
                  <DrillItem
                    key={count}
                    title={
                      count === 1
                        ? `Level ${String(keys.length + 1)}`
                        : `${String(count)} Levels Deeper`
                    }
                    onClick={() => push(count)}
                  />
                ))}
              </List.Group>
            </List.Section>
          </Level>
        ))}
      </Navigation.Stack>
    </Navigation.Root>
  );
};

/**
 * Settings, three levels deep at first: Done on every pushed page (a
 * persistent item, staying put between them, not on the root), popping to
 * the root from code; at the root, two levels pushed at once from code (as
 * the docs' "Popping to the root").
 */
export const FromCodeApp: FunctionComponent = () => {
  const [keys, setKeys] = useState(['settings', 'general', 'about']);
  const push = (...next: string[]) =>
    setKeys((current) => [...current, ...next]);

  return (
    <Navigation.Root onBack={() => setKeys((current) => current.slice(0, -1))}>
      <SinkSwipeAreas />
      <Navigation.Stack>
        {keys.map((key, index) => (
          <Level
            key={key}
            back={index > 0 ? pages[keys[index - 1] ?? '']?.title : undefined}
            title={pages[key]?.title ?? key}
            trailing={
              index > 0 ? (
                <Navigation.Persistent
                  persistentId="done"
                  render={<Toolbar.Button />}
                  onClick={() => setKeys((current) => current.slice(0, 1))}
                >
                  <Button.Label>Done</Button.Label>
                </Navigation.Persistent>
              ) : undefined
            }
          >
            <List.Section>
              <List.Group>
                {pages[key]?.children.map((child) => (
                  <DrillItem
                    key={child}
                    title={pages[child]?.title ?? child}
                    onClick={() => push(child)}
                  />
                ))}
              </List.Group>
              {index > 0 ? (
                <List.Footer>
                  Done stays put between the pushed pages (a persistent item, as
                  the back button), and pops to the root from code.
                </List.Footer>
              ) : null}
            </List.Section>
            {index === 0 ? (
              <List.Section>
                <List.Header>
                  <List.Title>From Code</List.Title>
                </List.Header>
                <List.Group>
                  <DrillItem
                    title="General, Then About (Two at Once)"
                    onClick={() => push('general', 'about')}
                  />
                </List.Group>
              </List.Section>
            ) : null}
          </Level>
        ))}
      </Navigation.Stack>
    </Navigation.Root>
  );
};

type Stacks = Record<SectionValue, string[]>;

const rootStacks: Stacks = { mail: ['mail'], settings: ['settings'] };

/**
 * A tab bar app: each tab its own stack (separate stacks), kept while
 * switching; its tab pressed again, back to its root (as the docs' "A
 * stack per tab").
 */
export const PerTabApp: FunctionComponent = () => {
  const [tab, setTab] = useState<SectionValue>('settings');
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const setStack = (
    section: SectionValue,
    next: (current: string[]) => string[],
  ) =>
    setStacks((current) => ({ ...current, [section]: next(current[section]) }));

  return (
    <TabBar.Root
      value={tab}
      onValueChange={(value: SectionValue) => setTab(value)}
    >
      {sections.map(([section]) => (
        <TabBar.Panel
          key={section}
          keepMounted
          value={section}
          render={
            <Navigation.Root
              onBack={() => setStack(section, (stack) => stack.slice(0, -1))}
            />
          }
        >
          <SinkSwipeAreas isActive={section === tab} />
          <Navigation.Stack>
            {stacks[section].map((key, index) => (
              <Level
                key={key}
                title={pages[key]?.title ?? key}
                back={
                  index > 0
                    ? pages[stacks[section][index - 1] ?? '']?.title
                    : undefined
                }
              >
                <List.Section>
                  <List.Group>
                    {pages[key]?.children.map((child) => (
                      <DrillItem
                        key={child}
                        title={pages[child]?.title ?? child}
                        onClick={() =>
                          setStack(section, (stack) => [...stack, child])
                        }
                      />
                    ))}
                  </List.Group>
                  <List.Footer>
                    Each tab keeps its own stack; its tab pressed again pops it
                    to its root.
                  </List.Footer>
                </List.Section>
              </Level>
            ))}
          </Navigation.Stack>
        </TabBar.Panel>
      ))}
      <Viewport.BlockEnd keyboard="cover">
        <TabBar.List>
          <TabBar.Group>
            <TabBar.Indicator />
            {sections.map(([section, label, icon]) => (
              <TabBar.Tab
                key={section}
                value={section}
                onClick={() => {
                  if (tab === section) {
                    setStack(section, (stack) => stack.slice(0, 1));
                  }
                }}
              >
                <TabBar.Icon>
                  <Symbol icon={icon} />
                </TabBar.Icon>
                <TabBar.Label>{label}</TabBar.Label>
              </TabBar.Tab>
            ))}
          </TabBar.Group>
        </TabBar.List>
      </Viewport.BlockEnd>
    </TabBar.Root>
  );
};
