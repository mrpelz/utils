import { FunctionComponent, ReactNode, useRef, useState } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  ContextualMenu,
  EditMenu,
  List,
  Menu,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSelectionAnchor,
  useSizeClass,
  useTextActionsPrevention,
} from '../../components/index.js';
import { photo } from '../docs/avatar/props.js';
import {
  sfBook,
  sfChevronRight,
  sfChevronUpChevronDown,
  sfDocumentOnDocument,
  sfEllipsis,
  sfEyeglasses,
  sfHeart,
  sfLockFill,
  sfPerson2Fill,
  sfPhoto,
  sfPinFill,
  sfPlus,
  sfSquare,
  sfSquareAndArrowUp,
  sfTrash,
  sfXmark,
} from '../tooling/icons.js';
import { Row, Rows, Showcase, type SinkPages } from './shared.js';

// Actions: Button, Menu, Contextual Menu, Edit Menu, Activity View.

const variants = [
  'borderless',
  'bordered',
  'bordered-secondary',
  'bordered-prominent',
  'glass',
  'glass-prominent',
] as const;

const sizes = ['small', 'medium', 'large'] as const;

const ButtonContent: FunctionComponent = () => (
  <List.Root>
    {variants.map((variant) => (
      <Showcase
        key={variant}
        title={variant}
      >
        {sizes.map((size) => (
          <Button.Root
            key={size}
            size={size}
            variant={variant}
          >
            <Button.Label>{size}</Button.Label>
          </Button.Root>
        ))}
        <Button.Root variant={variant}>
          <Button.Icon>
            <Symbol icon={sfPlus} />
          </Button.Icon>
          <Button.Label>Add</Button.Label>
        </Button.Root>
        <Button.Root
          aria-label="Add"
          shape="circle"
          variant={variant}
        >
          <Button.Icon>
            <Symbol icon={sfPlus} />
          </Button.Icon>
        </Button.Root>
        <Button.Root
          shape="roundedRectangle"
          variant={variant}
        >
          <Button.Label>Rounded</Button.Label>
        </Button.Root>
        <Button.Root
          destructive
          variant={variant}
        >
          <Button.Label>Delete</Button.Label>
        </Button.Root>
        <Button.Root
          disabled
          variant={variant}
        >
          <Button.Label>Disabled</Button.Label>
        </Button.Root>
      </Showcase>
    ))}
    <Showcase title="Tints">
      {[
        'var(--color-ui-system-green)',
        'var(--color-ui-system-orange)',
        'var(--color-ui-system-purple)',
      ].map((tint) => (
        <Button.Root
          key={tint}
          tint={tint}
          variant="bordered-prominent"
        >
          <Button.Label>Tinted</Button.Label>
        </Button.Root>
      ))}
      <Button.Root
        textColor="#000"
        tint="var(--color-ui-system-yellow)"
        variant="bordered-prominent"
      >
        <Button.Label>Dark Text</Button.Label>
      </Button.Root>
      <Button.Root
        tint="var(--color-ui-system-teal)"
        variant="glass-prominent"
      >
        <Button.Label>Tinted Glass</Button.Label>
      </Button.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Filling the Width"
    >
      <Button.Root
        fill
        size="large"
        variant="bordered-prominent"
      >
        <Button.Label>Continue</Button.Label>
      </Button.Root>
      <Button.Root
        fill
        size="large"
        variant="bordered"
      >
        <Button.Label>Not Now</Button.Label>
      </Button.Root>
    </Showcase>
    <Showcase title="Icons and Labels">
      <Button.Root variant="bordered-secondary">
        <Button.Icon>
          <Symbol icon={sfPerson2Fill} />
        </Button.Icon>
        <Button.Label>Invited</Button.Label>
        <Button.Icon>
          <Symbol icon={sfChevronRight} />
        </Button.Icon>
      </Button.Root>
      <Button.Root variant="bordered">
        <Button.Label>Sort</Button.Label>
        <Button.Icon>
          <Symbol icon={sfChevronUpChevronDown} />
        </Button.Icon>
      </Button.Root>
    </Showcase>
    <List.Section>
      <List.Header>
        <List.Title>Glass on a Picture</List.Title>
      </List.Header>
      <div className="kitchen-sink-picture kitchen-sink-showcase">
        {(['bright', 'dim', 'adaptive'] as const).map((context) => (
          <Button.Root
            key={context}
            context={context}
            variant="glass"
          >
            <Button.Label>{context}</Button.Label>
          </Button.Root>
        ))}
        <Button.Root
          aria-label="Share"
          context="adaptive"
          shape="circle"
          variant="glass"
        >
          <Button.Icon>
            <Symbol icon={sfSquareAndArrowUp} />
          </Button.Icon>
        </Button.Root>
        <Button.Root
          context="adaptive"
          variant="glass-prominent"
        >
          <Button.Label>Prominent</Button.Label>
        </Button.Root>
      </div>
    </List.Section>
  </List.Root>
);

/** A menu's items: quick actions, items of every kind, groups, a submenu. */
const fullMenu = (
  <>
    <Menu.QuickActions>
      <Menu.QuickAction>
        <Menu.Icon>
          <Symbol icon={sfSquareAndArrowUp} />
        </Menu.Icon>
        <Menu.Label>Share</Menu.Label>
      </Menu.QuickAction>
      <Menu.QuickAction>
        <Menu.Icon>
          <Symbol icon={sfPinFill} />
        </Menu.Icon>
        <Menu.Label>Pin</Menu.Label>
      </Menu.QuickAction>
      <Menu.QuickAction destructive>
        <Menu.Icon>
          <Symbol icon={sfLockFill} />
        </Menu.Icon>
        <Menu.Label>Lock</Menu.Label>
      </Menu.QuickAction>
    </Menu.QuickActions>
    <Menu.Separator />
    <Menu.Item>
      <Menu.Icon>
        <Symbol icon={sfSquare} />
      </Menu.Icon>
      <Menu.Label>Action</Menu.Label>
      <Menu.Shortcut>⌘A</Menu.Shortcut>
    </Menu.Item>
    <Menu.Item disabled>
      <Menu.Icon>
        <Symbol icon={sfSquare} />
      </Menu.Icon>
      <Menu.Label>Disabled Action</Menu.Label>
      <Menu.Shortcut>⇧⌘A</Menu.Shortcut>
    </Menu.Item>
    <Menu.Item>
      <Menu.Icon>
        <Symbol icon={sfSquare} />
      </Menu.Icon>
      <Menu.Label>Action</Menu.Label>
      <Menu.Subtitle>With a subtitle</Menu.Subtitle>
    </Menu.Item>
    <Menu.Item destructive>
      <Menu.Icon>
        <Symbol icon={sfTrash} />
      </Menu.Icon>
      <Menu.Label>Delete</Menu.Label>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Group>
      <Menu.GroupLabel>Section Title</Menu.GroupLabel>
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger>
          <Menu.Icon>
            <Symbol icon={sfSquare} />
          </Menu.Icon>
          <Menu.Label>Submenu</Menu.Label>
        </Menu.SubmenuTrigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>
                <Menu.Label>Submenu Action</Menu.Label>
              </Menu.Item>
              <Menu.Item>
                <Menu.Label>Another Action</Menu.Label>
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.SubmenuRoot>
      <Menu.Item>
        <Menu.Icon>
          <Symbol icon={sfSquare} />
        </Menu.Icon>
        <Menu.Label>An action with a long label, wrapping</Menu.Label>
      </Menu.Item>
    </Menu.Group>
  </>
);

/** A menu's toggles and a choice: checkbox items, a radio group. */
const ChoicesMenu: FunctionComponent = () => {
  const [groupBy, setGroupBy] = useState<unknown>('kind');

  return (
    <>
      <Menu.CheckboxItem defaultChecked>
        <Menu.CheckboxItemIndicator />
        <Menu.Label>Previews</Menu.Label>
      </Menu.CheckboxItem>
      <Menu.CheckboxItem>
        <Menu.CheckboxItemIndicator />
        <Menu.Label>Hidden Files</Menu.Label>
      </Menu.CheckboxItem>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Group By</Menu.GroupLabel>
        <Menu.RadioGroup
          value={groupBy}
          onValueChange={(value: unknown) => setGroupBy(value)}
        >
          {['kind', 'date', 'size'].map((value) => (
            <Menu.RadioItem
              key={value}
              value={value}
            >
              <Menu.RadioItemIndicator />
              <Menu.Label>{value}</Menu.Label>
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Group>
    </>
  );
};

/** A menu opened by a button (its variant), of a size, at a side. */
const MenuButton: FunctionComponent<{
  children: ReactNode;
  label: string;
  side?: 'block-end' | 'block-start' | 'inline-end' | 'inline-start';
  size?: 'compact' | 'regular';
}> = ({ children, label, side, size }) => (
  <Menu.Root size={size}>
    <Menu.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>{label}</Button.Label>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner side={side}>
        <Menu.Popup>{children}</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

const sortLabels: Record<string, string> = {
  date: 'Date',
  name: 'Name',
  size: 'Size',
};

/** A row's pop-up button: its value, a menu of the others. */
const SortRow: FunctionComponent = () => {
  const [sort, setSort] = useState('date');

  return (
    <Row title="Sort By">
      <Menu.Root>
        <Menu.Trigger render={<Button.Root />}>
          <Button.Label>{sortLabels[sort]}</Button.Label>
          <Button.Icon>
            <Symbol icon={sfChevronUpChevronDown} />
          </Button.Icon>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner align="end">
            <Menu.Popup>
              <Menu.RadioGroup
                value={sort}
                onValueChange={(value: unknown) => setSort(String(value))}
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <Menu.RadioItem
                    key={value}
                    value={value}
                  >
                    <Menu.RadioItemIndicator />
                    <Menu.Label>{label}</Menu.Label>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Row>
  );
};

/** The page's bar: a “More” menu. */
const MenuTrailing: FunctionComponent = () => (
  <Toolbar.Trailing>
    <Menu.Root>
      <Menu.Trigger
        aria-label="More"
        render={<Toolbar.Button shape="circle" />}
      >
        <Button.Icon>
          <Symbol icon={sfEllipsis} />
        </Button.Icon>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>{fullMenu}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Toolbar.Trailing>
);

const MenuContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Everything in a Menu">
      <MenuButton label="Regular">{fullMenu}</MenuButton>
      <MenuButton
        label="Compact"
        size="compact"
      >
        {fullMenu}
      </MenuButton>
    </Showcase>
    <Showcase title="Toggles and a Choice">
      <MenuButton label="View Options">
        <ChoicesMenu />
      </MenuButton>
    </Showcase>
    <Showcase title="Sides">
      {(
        ['block-end', 'block-start', 'inline-end', 'inline-start'] as const
      ).map((side) => (
        <MenuButton
          key={side}
          label={side}
          side={side}
        >
          <Menu.Item>
            <Menu.Label>One</Menu.Label>
          </Menu.Item>
          <Menu.Item>
            <Menu.Label>Two</Menu.Label>
          </Menu.Item>
        </MenuButton>
      ))}
    </Showcase>
    <Rows title="In a Row">
      <SortRow />
    </Rows>
  </List.Root>
);

/** A photo's tile (a gradient, its symbol). */
const PhotoTile: FunctionComponent<{ hue: number }> = ({ hue }) => (
  <span
    className="kitchen-sink-photo"
    style={{ backgroundImage: `url("${photo(hue)}")` }}
  />
);

/** A photo's contextual menu, with its preview (or without), its backdrop. */
const PhotoMenu: FunctionComponent<{
  hasPreview: boolean;
  hue: number;
  label: string;
}> = ({ hasPreview, hue, label }) => (
  <ContextualMenu.Root>
    <ContextualMenu.Trigger
      aria-label={label}
      className="kitchen-sink-photo-trigger"
    >
      <PhotoTile hue={hue} />
    </ContextualMenu.Trigger>
    {hasPreview ? (
      <ContextualMenu.Preview>
        <span className="kitchen-sink-photo-preview">
          <PhotoTile hue={hue} />
        </span>
      </ContextualMenu.Preview>
    ) : null}
    <ContextualMenu.Portal>
      <ContextualMenu.Backdrop />
      <ContextualMenu.Positioner>
        <ContextualMenu.Popup>
          <ContextualMenu.Item>
            <ContextualMenu.Label>Share</ContextualMenu.Label>
            <ContextualMenu.Icon>
              <Symbol icon={sfSquareAndArrowUp} />
            </ContextualMenu.Icon>
          </ContextualMenu.Item>
          <ContextualMenu.Item>
            <ContextualMenu.Label>Copy</ContextualMenu.Label>
            <ContextualMenu.Icon>
              <Symbol icon={sfDocumentOnDocument} />
            </ContextualMenu.Icon>
          </ContextualMenu.Item>
          <ContextualMenu.Item>
            <ContextualMenu.Label>Favorite</ContextualMenu.Label>
            <ContextualMenu.Icon>
              <Symbol icon={sfHeart} />
            </ContextualMenu.Icon>
          </ContextualMenu.Item>
          <ContextualMenu.Separator />
          <ContextualMenu.Item destructive>
            <ContextualMenu.Label>Delete</ContextualMenu.Label>
            <ContextualMenu.Icon>
              <Symbol icon={sfTrash} />
            </ContextualMenu.Icon>
          </ContextualMenu.Item>
        </ContextualMenu.Popup>
      </ContextualMenu.Positioner>
    </ContextualMenu.Portal>
  </ContextualMenu.Root>
);

const ContextualMenuContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Photos (Press and Hold, or Right-Click)">
      <PhotoMenu
        hasPreview
        hue={20}
        label="Photo, with a preview"
      />
      <PhotoMenu
        hasPreview={false}
        hue={200}
        label="Photo, without a preview"
      />
    </Showcase>
    <Showcase title="A Button">
      <ContextualMenu.Root>
        <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
          <Button.Icon>
            <Symbol icon={sfPhoto} />
          </Button.Icon>
          <Button.Label>Photo</Button.Label>
        </ContextualMenu.Trigger>
        <ContextualMenu.Portal>
          <ContextualMenu.Backdrop />
          <ContextualMenu.Positioner>
            <ContextualMenu.Popup>
              <ContextualMenu.Item>
                <ContextualMenu.Label>Share</ContextualMenu.Label>
                <ContextualMenu.Icon>
                  <Symbol icon={sfSquareAndArrowUp} />
                </ContextualMenu.Icon>
              </ContextualMenu.Item>
              <ContextualMenu.Item destructive>
                <ContextualMenu.Label>Delete</ContextualMenu.Label>
                <ContextualMenu.Icon>
                  <Symbol icon={sfTrash} />
                </ContextualMenu.Icon>
              </ContextualMenu.Item>
            </ContextualMenu.Popup>
          </ContextualMenu.Positioner>
        </ContextualMenu.Portal>
      </ContextualMenu.Root>
    </Showcase>
  </List.Root>
);

/** An edit menu above a text selection (its actions, more behind “›”). */
const SelectionMenu: FunctionComponent = () => {
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);

  return (
    <EditMenu.Root
      open={selection !== null}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) clearSelection();
      }}
    >
      <p
        ref={setText}
        className="kitchen-sink-selectable"
      >
        Select some of this text: the edit menu shows above the selection, with
        its actions, and more of them behind the chevron.
      </p>
      <EditMenu.Portal>
        <EditMenu.Positioner anchor={selection ?? text}>
          <EditMenu.Popup>
            <EditMenu.Item>Cut</EditMenu.Item>
            <EditMenu.Item>Copy</EditMenu.Item>
            <EditMenu.Item>Paste</EditMenu.Item>
            <EditMenu.Item destructive>Delete</EditMenu.Item>
            <EditMenu.Item>Replace…</EditMenu.Item>
            <EditMenu.SubmenuRoot>
              <EditMenu.More />
              <EditMenu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>
                      <Menu.Label>Look Up</Menu.Label>
                    </Menu.Item>
                    <Menu.Item>
                      <Menu.Label>Translate</Menu.Label>
                    </Menu.Item>
                    <Menu.Item>
                      <Menu.Label>Share…</Menu.Label>
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </EditMenu.Portal>
            </EditMenu.SubmenuRoot>
          </EditMenu.Popup>
        </EditMenu.Positioner>
      </EditMenu.Portal>
    </EditMenu.Root>
  );
};

/** An edit menu at an element (a photo, pressed), of a size. */
const ElementMenu: FunctionComponent<{ size?: 'compact' | 'regular' }> = ({
  size,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const element = useRef<HTMLButtonElement>(null);
  useTextActionsPrevention(element);

  return (
    <EditMenu.Root
      open={isOpen}
      size={size}
      onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
    >
      <button
        ref={element}
        aria-label={`Photo (${size ?? 'regular'})`}
        className="kitchen-sink-photo-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <PhotoTile hue={size === 'compact' ? 120 : 280} />
      </button>
      <EditMenu.Portal>
        <EditMenu.Positioner anchor={element}>
          <EditMenu.Popup>
            <EditMenu.Item>Copy</EditMenu.Item>
            <EditMenu.Item>Share…</EditMenu.Item>
            <EditMenu.Item>Look Up</EditMenu.Item>
            <EditMenu.Item>Translate</EditMenu.Item>
            <EditMenu.Item>Add to Album</EditMenu.Item>
            <EditMenu.Item destructive>Delete</EditMenu.Item>
          </EditMenu.Popup>
        </EditMenu.Positioner>
      </EditMenu.Portal>
    </EditMenu.Root>
  );
};

const EditMenuContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="At a Selection"
    >
      <SelectionMenu />
    </Showcase>
    <Showcase title="At an Element (Pressed): Regular, Compact">
      <ElementMenu />
      <ElementMenu size="compact" />
    </Showcase>
  </List.Root>
);

const people = [
  ['Ashley Kamin', 'AK', 20],
  ['Amber Spiers', 'AS', 200],
  ['Simon Pickford', 'SP', undefined],
  ['Lea Rossi', 'LR', 50],
] as const;

const actions = [
  ['Copy', sfDocumentOnDocument],
  ['Add to Favorites', sfHeart],
  ['Add to Reading List', sfEyeglasses],
  ['Add Bookmark', sfBook],
] as const;

/** An activity view's content: its header, people, actions, rows. */
const activityContent = (close: ReactNode) => (
  <>
    <ActivityView.Header>
      <ActivityView.Thumbnail>
        <img
          alt=""
          src={photo(30)}
        />
      </ActivityView.Thumbnail>
      <ActivityView.Heading>
        <ActivityView.Title>Harbor Walk</ActivityView.Title>
        <ActivityView.Subtitle>Photo · 2.4 MB</ActivityView.Subtitle>
        <Button.Root
          size="small"
          variant="bordered-secondary"
        >
          <Button.Icon>
            <Symbol icon={sfPerson2Fill} />
          </Button.Icon>
          <Button.Label>Options</Button.Label>
          <Button.Icon>
            <Symbol icon={sfChevronRight} />
          </Button.Icon>
        </Button.Root>
        <ActivityView.Message>
          Only invited people can edit.
        </ActivityView.Message>
      </ActivityView.Heading>
      {close}
    </ActivityView.Header>
    <ActivityView.Separator />
    <ActivityView.People aria-label="People">
      {people.map(([name, initials, hue]) => (
        <ActivityView.Person key={name}>
          <Avatar.Root>
            {hue === undefined ? null : <Avatar.Image src={photo(hue)} />}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
          <ActivityView.Name>{name}</ActivityView.Name>
        </ActivityView.Person>
      ))}
      <ActivityView.Person>
        <Avatar.Group>
          <Avatar.Root>
            <Avatar.Image src={photo(120)} />
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Image src={photo(280)} />
          </Avatar.Root>
        </Avatar.Group>
        <ActivityView.Name>Gary and Fatima</ActivityView.Name>
        <ActivityView.Count>2 People</ActivityView.Count>
      </ActivityView.Person>
    </ActivityView.People>
    <ActivityView.Separator />
    <ActivityView.Actions aria-label="Actions">
      {actions.map(([label, icon]) => (
        <ActivityView.Action key={label}>
          <ActivityView.Symbol>
            <Symbol icon={icon} />
          </ActivityView.Symbol>
          <ActivityView.Label>{label}</ActivityView.Label>
        </ActivityView.Action>
      ))}
    </ActivityView.Actions>
    <List.Root>
      <List.Section>
        <List.Group>
          {actions.map(([label, icon]) => (
            <List.Item key={label}>
              <List.Leading>
                <List.Image variant="symbol">
                  <Symbol icon={icon} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title render={<button type="button" />}>
                  {label}
                </List.Title>
              </List.Content>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    </List.Root>
  </>
);

const closeButton = (
  <Button.Root
    aria-label="Close"
    shape="circle"
    variant="glass"
  />
);

const closeIcon = (
  <Button.Icon>
    <Symbol icon={sfXmark} />
  </Button.Icon>
);

/** The activity view: a sheet (compact), or a popover (regular). */
const ActivityViewContent: FunctionComponent = () => {
  const isCompact = useSizeClass() === 'compact';
  const trigger = (
    <Button.Root
      size="large"
      variant="bordered"
    />
  );
  const label = (
    <>
      <Button.Icon>
        <Symbol icon={sfSquareAndArrowUp} />
      </Button.Icon>
      <Button.Label>Share</Button.Label>
    </>
  );

  return (
    <List.Root>
      <Showcase title={isCompact ? 'In a Sheet' : 'In a Popover'}>
        {isCompact ? (
          <Sheet.Root>
            <Sheet.Trigger render={trigger}>{label}</Sheet.Trigger>
            <Sheet.Popup
              compact
              detent="medium"
            >
              <Sheet.Header>
                <Sheet.Grabber />
              </Sheet.Header>
              <Sheet.Content>
                {activityContent(
                  <Sheet.Close render={closeButton}>{closeIcon}</Sheet.Close>,
                )}
              </Sheet.Content>
            </Sheet.Popup>
          </Sheet.Root>
        ) : (
          <Popover.Root>
            <Popover.Trigger render={trigger}>{label}</Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup className="kitchen-sink-activity-popup">
                  <Popover.Arrow />
                  <Popover.Body>
                    {activityContent(
                      <Popover.Close render={closeButton}>
                        {closeIcon}
                      </Popover.Close>,
                    )}
                  </Popover.Body>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        )}
      </Showcase>
    </List.Root>
  );
};

export const actionsPages: SinkPages = {
  'activity-view': { Content: ActivityViewContent, title: 'Activity View' },
  button: { Content: ButtonContent, title: 'Button' },
  'contextual-menu': {
    Content: ContextualMenuContent,
    title: 'Contextual Menu',
  },
  'edit-menu': { Content: EditMenuContent, title: 'Edit Menu' },
  menu: { Content: MenuContent, title: 'Menu', Trailing: MenuTrailing },
};
