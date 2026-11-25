import '../glass/style.css';
import '../switch/style.css';
import '../slider/style.css';
import '../grid/style.css';
import '../list/style.css';
import './style.css';
import './parts.css';

import { CloseButton, ExpandButton, OpenButton } from './buttons.js';
import { Channel, Channels } from './channels.js';
import {
  Progress,
  ProgressBar,
  ProgressDetail,
  ProgressLabel,
  ProgressValue,
} from './progress.js';
import {
  CardSwitch,
  CardSymbol,
  CornerButton,
  Root,
  Subtitle,
  Title,
  Trend,
  Value,
} from './root.js';
import { Row, Rows } from './rows.js';
import { Segmented, SegmentedItem } from './segmented.js';
import { CardSlider } from './slider.js';
import { Stage, StageList } from './stages.js';

export type {
  CardActions,
  CardChannelProps,
  CardChannelsProps,
  CardCloseButtonProps,
  CardCornerButtonProps,
  CardExpandButtonProps,
  CardFormat,
  CardLight,
  CardOpenButtonProps,
  CardOrientation,
  CardProgressBarProps,
  CardProgressDetailProps,
  CardProgressLabelProps,
  CardProgressProps,
  CardProgressValueProps,
  CardRootProps,
  CardRowProps,
  CardRowsProps,
  CardSegmentedItemProps,
  CardSegmentedProps,
  CardSizes,
  CardSliderProps,
  CardStageListProps,
  CardStageProps,
  CardSubtitleProps,
  CardSwitchProps,
  CardSymbolProps,
  CardTitleProps,
  CardTrendProps,
  CardValueProps,
} from './props.js';
export { CardBlendScope, cardSizes, useCardOrientation } from './root.js';

// Cards: a surface for what an app shows or controls in a grid's tile (a
// `Grid.Item`'s, nested in it), or on its own. Glass (the Sidebar's and
// Islands' medium material, its colors by what's behind); its parts laid
// out by its own size (container queries), more shown the larger it is.
//
// Also:
// - In edit mode (its item's grid's), its content is inert (presses go to
//   the grid: held, it's dragged; but its corner buttons shown then, over
//   it, see `CornerButton`) and veiled, so the grid's corner symbols
//   read on it. The veil lifts (and those symbols fade with it) while a
//   tile's dragged or resized, on every card of the grid, so they show
//   their content as the grid changes; a resized tile's outline shows as
//   ever.
// - A `Switch` in it is styled by it (smaller, in its top trailing
//   corner), its state the card's whole background: on, bright (its text
//   dark), off, its glass. A press on the card toggles it as a row's does
//   (`forwardClick`).
// - A `Slider` in it is styled by it: its whole surface the track, the
//   fill the background (its ticks across it), no knob; horizontal or
//   vertical by the tile's shape (see `useCardOrientation`). Its label and
//   value laid out as a card's title and value. `Card.Slider` makes that
//   fill opaque and registers a layer inside it (see `CardBlendScope`),
//   where the card's parts draw copies of themselves in the fill's colors;
//   Slider itself knows nothing of cards.
// - Its building blocks, each a part composed among the others: a subtitle,
//   a trend in its value, a slider filling it, a progress (its value, its
//   bar), stages, channels, a choice of a few, rows; corner buttons
//   expanding its tile, opening it above the page, closing it (its grid
//   item's state). Parts named by its title (a progress bar, stages, a
//   choice) read its id from it (see `Card.Title`).
// - A binary card's state also shows as its brightness (`active`: a
//   display's, e.g. a lock locked; a control's, its switch on). Pressable
//   as a whole (an `onClick`), it shows it: hovered, pressed. A display
//   without one doesn't.
// - A corner button (`Card.CornerButton`, a `Grid.CornerButton`) does
//   what's more to it: expanding it in place (the app's size for it),
//   opening it above the page, going to a page of its own; its icon one of
//   `gridIcons` or the app's. Shown outside edit mode only (the grid's own
//   controls take the corners then).
// - Its tile getting to a new box (expanded, collapsed, opened above the
//   page, closed; see Grid's reshape.ts): its glass resized with it (not
//   stretched, clipping what's in it), its parts laid out at the new size
//   at once (its frame, at the size it's getting to); its corner buttons
//   staying in their corners as its edges move (`useCornersFollowing`).
//   The rest of its parts stay where they're laid out: moving them from
//   where they were is the app's (e.g. by an animation library, see
//   `useGridItemLayout`).

export const Card = {
  Root,
  Symbol: CardSymbol,
  Title,
  Subtitle,
  Value,
  Trend,
  Switch: CardSwitch,
  Slider: CardSlider,
  Progress,
  ProgressValue,
  ProgressBar,
  ProgressLabel,
  ProgressDetail,
  StageList,
  Stage,
  Channels,
  Channel,
  Segmented,
  SegmentedItem,
  Rows,
  Row,
  CornerButton,
  ExpandButton,
  OpenButton,
  CloseButton,
};
