import '../docs/island/style.css';

import { FunctionComponent, ReactNode, useState } from 'react';

import {
  ActionSheet,
  Alert,
  Button,
  Island,
  List,
  Popover,
  Sheet,
  type SheetRegular,
  type SheetSwipeDirection,
  Symbol,
  Toolbar,
  Tooltip,
  useSizeClass,
  Viewport,
} from '../../components/index.js';
import { MapView } from '../docs/island/map.js';
import {
  sfEllipsis,
  sfICircle,
  sfSquareAndArrowUp,
  sfTrash,
  sfXmark,
} from '../tooling/icons.js';
import { DrillRow, Row, Rows, Showcase, type SinkPages } from './shared.js';

// Presentation: Sheet, Island, Popover, Alert, Action Sheet, Tooltip.

const closeIcon = (
  <Button.Icon>
    <Symbol icon={sfXmark} />
  </Button.Icon>
);

/** A trigger's look (a bordered button). */
const triggerButton = <Button.Root variant="bordered" />;

/** Rows to scroll (a sheet's, a popover's). */
const fillerRows = (count: number, prefix = 'Row') =>
  Array.from({ length: count }, (_, index) => (
    <List.Item key={index}>
      <List.Content>
        <List.Title>
          {prefix} {index + 1}
        </List.Title>
      </List.Content>
    </List.Item>
  ));

/**
 * A sheet: its bar (a title, Cancel and Done, or a close), its rows: on a
 * plain (opaque) sheet a plain list, on a grouped one an inset grouped
 * list (each on the background it's made for), on a medium one's glass the
 * glass's.
 */
const SimpleSheet: FunctionComponent<{
  background?: 'grouped' | 'plain';
  compact?: boolean;
  detent?: 'large' | 'medium';
  hasCancelDone?: boolean;
  hasGrabber?: boolean;
  label: string;
  regular?: SheetRegular;
  rows?: number;
  swipeDirection?: SheetSwipeDirection;
}> = ({
  background,
  compact,
  detent,
  hasCancelDone = false,
  hasGrabber = true,
  label,
  regular,
  rows = 4,
  swipeDirection,
}) => {
  const sizeClass = useSizeClass();
  // (A form sheet: set, or by the window, not a card.)
  const isForm =
    compact === false ||
    (compact === undefined && sizeClass === 'regular' && regular !== 'card');

  return (
    <Sheet.Root swipeDirection={swipeDirection}>
      <Sheet.Trigger render={triggerButton}>
        <Button.Label>{label}</Button.Label>
      </Sheet.Trigger>
      <Sheet.Popup
        background={background}
        compact={compact}
        detent={detent}
        regular={regular}
      >
        <Sheet.Header>
          {hasGrabber ? <Sheet.Grabber /> : null}
          <Toolbar.Root placement="block-start">
            {hasCancelDone ? (
              <Toolbar.Leading>
                <Sheet.Close render={<Toolbar.Button />}>
                  <Button.Label>Cancel</Button.Label>
                </Sheet.Close>
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title>
              <Sheet.Title render={<span />}>{label}</Sheet.Title>
            </Toolbar.Title>
            <Toolbar.Trailing>
              {hasCancelDone ? (
                <Sheet.Close render={<Toolbar.Button prominent />}>
                  <Button.Label>Done</Button.Label>
                </Sheet.Close>
              ) : (
                <Sheet.Close
                  render={
                    <Toolbar.Button
                      aria-label="Close"
                      shape="circle"
                    />
                  }
                >
                  {closeIcon}
                </Sheet.Close>
              )}
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Sheet.Header>
        <Sheet.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root
            listStyle={
              background !== 'grouped' &&
              ((detent ?? 'large') === 'large' || isForm)
                ? 'plain'
                : undefined
            }
          >
            <List.Section>
              <List.Group>{fillerRows(rows)}</List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Sheet.Content>
      </Sheet.Popup>
    </Sheet.Root>
  );
};

const reviewers = [
  'Aaron',
  'Abigail',
  'Adrian',
  'Bella',
  'Benjamin',
  'Chloe',
  'Daniel',
  'Dylan',
  'Ella',
  'Emma',
  'Felix',
  'Grace',
];

/** The place's stops shown from code (see `placeGroups`' `onShow`). */
const shownStops = [
  ['details', 'Show the Details'],
  ['all', 'Show the Reviews'],
] as const;

/**
 * A place's rows, by snap group: a peek, its details, its reviews; with
 * `onShow`, buttons in the peek showing a stop (from code).
 */
const placeGroups = (
  SnapGroup: typeof Sheet.SnapGroup | typeof Island.SnapGroup,
  onShow?: (stop: string) => void,
) => (
  <>
    <SnapGroup value="peek">
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content>
                <List.Title>Open until 6 PM</List.Title>
                <List.Subtitle>Café · 300 m</List.Subtitle>
              </List.Content>
            </List.Item>
            {onShow === undefined
              ? null
              : shownStops.map(([stop, label]) => (
                  <List.Item key={stop}>
                    <List.Content>
                      <List.Button onClick={() => onShow(stop)}>
                        {label}
                      </List.Button>
                    </List.Content>
                  </List.Item>
                ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </SnapGroup>
    <SnapGroup value="details">
      <List.Root>
        <List.Section>
          <List.Group>
            {['Call', 'Website', 'Directions'].map((name) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </SnapGroup>
    <SnapGroup value="all">
      <List.Root>
        <List.Section>
          <List.Group>
            {reviewers.map((name) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title>{name}</List.Title>
                  <List.Subtitle>Review</List.Subtitle>
                </List.Content>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </SnapGroup>
  </>
);

/** The place's bar (sharing, more), its title. */
const placeBar = (close?: ReactNode) => (
  <Toolbar.Root placement="block-start">
    <Toolbar.Leading>
      <Toolbar.Button
        aria-label="Share"
        disabled={false}
        shape="circle"
      >
        <Button.Icon>
          <Symbol icon={sfSquareAndArrowUp} />
        </Button.Icon>
      </Toolbar.Button>
    </Toolbar.Leading>
    <Toolbar.Title>
      <span>Harbor Café</span>
    </Toolbar.Title>
    <Toolbar.Trailing>
      <Toolbar.Button
        aria-label="More"
        disabled={false}
        shape="circle"
      >
        <Button.Icon>
          <Symbol icon={sfEllipsis} />
        </Button.Icon>
      </Toolbar.Button>
      {close}
    </Toolbar.Trailing>
  </Toolbar.Root>
);

/**
 * A place's sheet, snapping by its groups (its header alone the lowest,
 * swiped down to; without `hasHeaderStop`, none); opened at its peek, or a
 * trigger's stop.
 */
const PlaceSheet: FunctionComponent<{ hasHeaderStop?: boolean }> = ({
  hasHeaderStop = true,
}) => (
  <Sheet.Root defaultSnapPoint="peek">
    <div className="kitchen-sink-showcase">
      <Sheet.Trigger render={<Button.Root variant="bordered-prominent" />}>
        <Button.Label>Show Place</Button.Label>
      </Sheet.Trigger>
      {(
        [
          ['details', 'Details'],
          ['all', 'Reviews'],
        ] as const
      ).map(([stop, label]) => (
        <Sheet.Trigger
          key={stop}
          render={triggerButton}
          snapPoint={stop}
        >
          <Button.Label>{label}</Button.Label>
        </Sheet.Trigger>
      ))}
    </div>
    <Sheet.Popup
      detent="medium"
      regular="card"
    >
      <Sheet.Header>
        <Sheet.Grabber />
        {placeBar(
          <Sheet.Close
            render={
              <Toolbar.Button
                aria-label="Close"
                shape="circle"
              />
            }
          >
            {closeIcon}
          </Sheet.Close>,
        )}
      </Sheet.Header>
      <Sheet.Content>
        <Viewport.Padding edge="block-start" />
        {/* (Its header alone, a stop of its own: swiped down to it.) */}
        {hasHeaderStop ? <Sheet.SnapGroup value="header" /> : null}
        {placeGroups(Sheet.SnapGroup)}
        <Viewport.Padding edge="block-end" />
      </Sheet.Content>
    </Sheet.Popup>
  </Sheet.Root>
);

// On a tablet, its sheets follow the window's size class: a card at the
// leading edge (`regular` `card`) where a detent, swiping or snapping is
// shown; a form sheet for a task.
const SheetContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Detents">
      <SimpleSheet
        detent="large"
        label="Large"
        regular="card"
        rows={30}
      />
      <SimpleSheet
        detent="medium"
        label="Medium"
        regular="card"
      />
      <SimpleSheet
        background="grouped"
        detent="large"
        label="Grouped"
        regular="card"
        rows={12}
      />
    </Showcase>
    <Showcase
      footer="On a tablet, Cancel and Done is a task: a form sheet, centered."
      title="Header"
    >
      <SimpleSheet
        hasCancelDone
        label="Cancel and Done"
        rows={6}
      />
      <SimpleSheet
        detent="medium"
        hasGrabber={false}
        label="Without a Grabber"
        regular="card"
      />
    </Showcase>
    <Showcase title="Swiped Away">
      {(['down', 'up', 'left', 'right', 'none'] as const).map((direction) => (
        <SimpleSheet
          key={direction}
          detent="medium"
          label={direction}
          regular="card"
          swipeDirection={direction}
        />
      ))}
    </Showcase>
    <Showcase title="A Form Sheet (Centered)">
      <SimpleSheet
        hasCancelDone
        background="grouped"
        compact={false}
        label="Form Sheet"
        rows={8}
      />
    </Showcase>
    <Showcase
      isStacked
      title="Snapping by Groups (Opened at a Stop)"
    >
      <PlaceSheet />
    </Showcase>
    <Showcase
      isStacked
      footer="Expand it, scroll the reviews, then drag the header down: with the groups scrolled away and no header stop, it swipes out at once."
      title="Snapping by Groups, Without a Header Stop"
    >
      <PlaceSheet hasHeaderStop={false} />
    </Showcase>
  </List.Root>
);

/**
 * An island over a map (in the page's anchor, see `Anchors`): its stop
 * the app's (controlled, from `initialStop`), swiped to, or shown from code
 * (`isShownFromCode`: buttons in its peek).
 */
const PlaceIsland: FunctionComponent<{
  hasGroups: boolean;
  /** A stop of its header alone (unless a sliver's instead). */
  hasHeaderStop?: boolean;
  initialStop: string | undefined;
  isShownFromCode?: boolean;
  isSliver?: boolean;
}> = ({
  hasGroups,
  hasHeaderStop = true,
  initialStop,
  isShownFromCode = false,
  isSliver = false,
}) => {
  const [stop, setStop] = useState(initialStop);

  return (
    <Viewport.Anchor
      edge="block-end"
      edgeEffect="none"
    >
      <Island.Root
        snapPoint={stop}
        onSnapPointChange={(next: string) => setStop(next)}
      >
        <Island.Header>
          {hasGroups ? <Island.Grabber /> : null}
          {isSliver ? <Island.SnapGroup value="sliver" /> : null}
          {placeBar()}
        </Island.Header>
        <Island.Content>
          <Viewport.Padding edge="block-start" />
          {hasGroups ? (
            <>
              {isSliver || !hasHeaderStop ? null : (
                <Island.SnapGroup value="header" />
              )}
              {placeGroups(
                Island.SnapGroup,
                isShownFromCode ? setStop : undefined,
              )}
            </>
          ) : (
            <List.Root>
              <List.Section>
                <List.Group>{fillerRows(3, 'Stop')}</List.Group>
              </List.Section>
            </List.Root>
          )}
          <Viewport.Padding edge="block-end" />
        </Island.Content>
      </Island.Root>
    </Viewport.Anchor>
  );
};

/** An island over a map (a page filling the screen, see `Anchors`). */
const islandPage = (
  initialStop: string | undefined,
  hasGroups: boolean,
  isSliver = false,
  hasHeaderStop = true,
): Pick<SinkPages[string], 'Anchors' | 'Content' | 'isFullBleed'> => ({
  Anchors: () => (
    <PlaceIsland
      hasGroups={hasGroups}
      hasHeaderStop={hasHeaderStop}
      initialStop={initialStop}
      isShownFromCode={hasGroups && !isSliver && hasHeaderStop}
      isSliver={isSliver}
    />
  ),
  Content: () => <MapView isFollowing={isSliver} />,
  isFullBleed: true,
});

const IslandContent: FunctionComponent = () => (
  <List.Root>
    <Rows>
      <DrillRow
        pageKey="island/stops"
        title="Over a Map, Snapping (and Shown from Code)"
      />
      <DrillRow
        pageKey="island/sliver"
        title="Down to a Sliver"
      />
      <DrillRow
        pageKey="island/no-header-stop"
        title="Without a Header Stop (Scrolled, It Stays Put)"
      />
      <DrillRow
        pageKey="island/plain"
        title="Without Stops"
      />
    </Rows>
  </List.Root>
);

/** A popover: its header (a title), its rows; at a side and alignment. */
const InfoPopover: FunctionComponent<{
  align?: 'center' | 'end' | 'start';
  hasArrow?: boolean;
  label: string;
  rows?: number;
  side?: 'block-end' | 'block-start' | 'inline-end' | 'inline-start';
}> = ({ align, hasArrow = true, label, rows = 2, side }) => (
  <Popover.Root>
    <Popover.Trigger render={triggerButton}>
      <Button.Label>{label}</Button.Label>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner
        align={align}
        side={side}
      >
        <Popover.Popup className="kitchen-sink-popover">
          {hasArrow ? <Popover.Arrow /> : null}
          <Popover.Header>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <Popover.Title render={<span />}>Home Network</Popover.Title>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Popover.Close
                  render={
                    <Toolbar.Button
                      aria-label="Close"
                      shape="circle"
                    />
                  }
                >
                  {closeIcon}
                </Popover.Close>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Popover.Header>
          <Popover.Body>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>{fillerRows(rows, 'Detail')}</List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Popover.Body>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

const PopoverContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Sides">
      {(
        ['block-end', 'block-start', 'inline-end', 'inline-start'] as const
      ).map((side) => (
        <InfoPopover
          key={side}
          label={side}
          side={side}
        />
      ))}
    </Showcase>
    <Showcase title="Alignment">
      {(['start', 'center', 'end'] as const).map((align) => (
        <InfoPopover
          key={align}
          align={align}
          label={align}
        />
      ))}
    </Showcase>
    <Showcase title="Content">
      <InfoPopover
        hasArrow={false}
        label="No Arrow"
      />
      <InfoPopover
        label="Scrolling"
        rows={20}
      />
    </Showcase>
    <Rows title="From a Row">
      <Row title="Wi-Fi">
        <Popover.Root>
          <Popover.Trigger
            aria-label="Network info"
            render={<List.Accessory render={<button type="button" />} />}
          >
            <Symbol icon={sfICircle} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end">
              <Popover.Popup className="kitchen-sink-popover">
                <Popover.Arrow />
                <Popover.Header>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <Popover.Title render={<span />}>Wi-Fi</Popover.Title>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        <Row title="IP Address">
                          <List.Detail>192.168.1.24</List.Detail>
                        </Row>
                        <Row title="Router">
                          <List.Detail>192.168.1.1</List.Detail>
                        </Row>
                      </List.Group>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </Row>
    </Rows>
  </List.Root>
);

/** An alert opened by a button: its title, message, actions. */
const SimpleAlert: FunctionComponent<{
  children: ReactNode;
  description?: string;
  label: string;
  stacked?: boolean;
  title: string;
}> = ({ children, description, label, stacked, title }) => (
  <Alert.Root>
    <Alert.Trigger render={triggerButton}>
      <Button.Label>{label}</Button.Label>
    </Alert.Trigger>
    <Alert.Popup>
      <Alert.Header>
        <Alert.Title>{title}</Alert.Title>
        {description === undefined ? null : (
          <Alert.Description>{description}</Alert.Description>
        )}
      </Alert.Header>
      <Alert.Actions stacked={stacked}>{children}</Alert.Actions>
    </Alert.Popup>
  </Alert.Root>
);

/** An alert asking for a name (its field; Save while it's not empty). */
const RenameAlert: FunctionComponent = () => {
  const [folder, setFolder] = useState('Projects');
  const [name, setName] = useState(folder);

  return (
    <Row title={folder}>
      <Alert.Root
        onOpenChange={(isOpen: boolean) => {
          if (isOpen) setName(folder);
        }}
      >
        <Alert.Trigger
          render={
            <Button.Root
              size="small"
              variant="borderless"
            />
          }
        >
          <Button.Label>Rename</Button.Label>
        </Alert.Trigger>
        <Alert.Popup>
          <Alert.Header>
            <Alert.Title>Rename Folder</Alert.Title>
            <Alert.Description>Enter a name for this folder.</Alert.Description>
          </Alert.Header>
          <Alert.Fields>
            <Alert.Field
              aria-label="Name"
              placeholder="Name"
              value={name}
              onValueChange={(value: string) => setName(value)}
            />
          </Alert.Fields>
          <Alert.Actions>
            <Alert.Action>Cancel</Alert.Action>
            <Alert.Action
              disabled={name.trim() === ''}
              variant="primary"
              onClick={() => setFolder(name)}
            >
              Save
            </Alert.Action>
          </Alert.Actions>
        </Alert.Popup>
      </Alert.Root>
    </Row>
  );
};

const AlertContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Actions">
      <SimpleAlert
        description="The server can’t be reached. Try again later."
        label="One"
        title="Couldn’t Save Note"
      >
        <Alert.Action variant="primary">OK</Alert.Action>
      </SimpleAlert>
      <SimpleAlert
        description="This can’t be undone."
        label="Two"
        title="Delete Photo?"
      >
        <Alert.Action>Cancel</Alert.Action>
        <Alert.Action variant="destructive">Delete</Alert.Action>
      </SimpleAlert>
      <SimpleAlert
        description="Your message hasn’t been sent."
        label="Three (Stacked)"
        title="Save Draft?"
      >
        <Alert.Action variant="primary">Save Draft</Alert.Action>
        <Alert.Action variant="destructive">Delete Draft</Alert.Action>
        <Alert.Action>Cancel</Alert.Action>
      </SimpleAlert>
      <SimpleAlert
        stacked
        label="Two, Stacked"
        title="Allow Notifications?"
      >
        <Alert.Action variant="primary">Allow</Alert.Action>
        <Alert.Action>Don’t Allow</Alert.Action>
      </SimpleAlert>
      <SimpleAlert
        label="Title Only"
        title="Sign Out?"
      >
        <Alert.Action>Cancel</Alert.Action>
        <Alert.Action variant="primary">Sign Out</Alert.Action>
      </SimpleAlert>
    </Showcase>
    <Rows title="With a Field">
      <RenameAlert />
    </Rows>
  </List.Root>
);

/** An action sheet opened by a button: its header (or none), actions. */
const SimpleActionSheet: FunctionComponent<{
  children: ReactNode;
  description?: string;
  label: string;
  title?: string;
}> = ({ children, description, label, title }) => (
  <ActionSheet.Root>
    <ActionSheet.Trigger render={triggerButton}>
      <Button.Label>{label}</Button.Label>
    </ActionSheet.Trigger>
    <ActionSheet.Popup aria-label={title ?? label}>
      {title === undefined && description === undefined ? null : (
        <ActionSheet.Header>
          {title === undefined ? null : (
            <ActionSheet.Title>{title}</ActionSheet.Title>
          )}
          {description === undefined ? null : (
            <ActionSheet.Description>{description}</ActionSheet.Description>
          )}
        </ActionSheet.Header>
      )}
      <ActionSheet.Actions>{children}</ActionSheet.Actions>
    </ActionSheet.Popup>
  </ActionSheet.Root>
);

const ActionSheetContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Action Sheets">
      <SimpleActionSheet
        description="This photo will be deleted from all your devices."
        label="Delete Photo"
      >
        <ActionSheet.Action variant="destructive">
          Delete Photo
        </ActionSheet.Action>
        <ActionSheet.Action>Remove from Album</ActionSheet.Action>
      </SimpleActionSheet>
      <SimpleActionSheet
        description="Choose where to save it."
        label="Titled"
        title="Save Photo"
      >
        <ActionSheet.Action>Save to Photos</ActionSheet.Action>
        <ActionSheet.Action>Save to Files</ActionSheet.Action>
      </SimpleActionSheet>
      <SimpleActionSheet label="No Header">
        <ActionSheet.Action>Reply</ActionSheet.Action>
        <ActionSheet.Action>Forward</ActionSheet.Action>
        <ActionSheet.Action>Print</ActionSheet.Action>
      </SimpleActionSheet>
      <SimpleActionSheet
        label="Many Actions"
        title="Move to"
      >
        {[
          'Inbox',
          'Archive',
          'Drafts',
          'Sent',
          'Junk',
          'Work',
          'Family',
          'Receipts',
          'Travel',
          'Newsletters',
        ].map((folder) => (
          <ActionSheet.Action key={folder}>{folder}</ActionSheet.Action>
        ))}
      </SimpleActionSheet>
    </Showcase>
  </List.Root>
);

/** A tooltip on a button (its symbol), at a side. */
const TooltipButton: FunctionComponent<{
  icon: typeof sfTrash;
  label: string;
  side?: 'block-end' | 'block-start' | 'inline-end' | 'inline-start';
  text: string;
}> = ({ icon, label, side, text }) => (
  <Tooltip.Root>
    <Tooltip.Trigger
      aria-label={label}
      render={
        <Button.Root
          shape="circle"
          variant="bordered"
        />
      }
    >
      <Button.Icon>
        <Symbol icon={icon} />
      </Button.Icon>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner side={side}>
        <Tooltip.Popup>{text}</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

const TooltipContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Sides (Hover or Focus)">
      {(
        ['block-start', 'block-end', 'inline-start', 'inline-end'] as const
      ).map((side) => (
        <TooltipButton
          key={side}
          icon={sfSquareAndArrowUp}
          label={`Share (${side})`}
          side={side}
          text={side}
        />
      ))}
    </Showcase>
    <Showcase title="Several Together (Moving Between Them Shows at Once)">
      <Tooltip.Provider>
        <TooltipButton
          icon={sfSquareAndArrowUp}
          label="Share"
          text="Share"
        />
        <TooltipButton
          icon={sfTrash}
          label="Delete"
          text="Delete"
        />
        <TooltipButton
          icon={sfEllipsis}
          label="More"
          text="More actions"
        />
      </Tooltip.Provider>
    </Showcase>
    <Showcase title="Long Text">
      <TooltipButton
        icon={sfICircle}
        label="About"
        text="A tooltip with more text than fits on one line wraps onto the next."
      />
    </Showcase>
  </List.Root>
);

export const presentationPages: SinkPages = {
  'action-sheet': { Content: ActionSheetContent, title: 'Action Sheet' },
  alert: { Content: AlertContent, title: 'Alert' },
  island: { Content: IslandContent, title: 'Island' },
  'island/no-header-stop': {
    ...islandPage('peek', true, false, false),
    title: 'Without a Header Stop',
  },
  'island/plain': { ...islandPage(undefined, false), title: 'Without Stops' },
  'island/sliver': {
    ...islandPage('sliver', true, true),
    title: 'Down to a Sliver',
  },
  'island/stops': { ...islandPage('peek', true), title: 'Over a Map' },
  popover: { Content: PopoverContent, title: 'Popover' },
  sheet: { Content: SheetContent, title: 'Sheet' },
  tooltip: { Content: TooltipContent, title: 'Tooltip' },
};
