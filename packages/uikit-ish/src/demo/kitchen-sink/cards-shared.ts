import {
  type ComponentType,
  createContext,
  createElement,
  FunctionComponent,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from 'react';

import {
  Card,
  type CardRootProps,
  type CardRowProps,
  cardSizes,
  ControlCards,
  type GlassContextValue,
  type GridOpenSize,
  type GridSize,
  type SymbolIcon,
  useGridItem,
} from '../../components/index.js';

// What the Cards pages share (see cards.tsx, more-cards.tsx): a tile's
// shape, a card's rows, the lights' store.

/** A card's row's data (see `rowsOf`). */
export type RowData = {
  readonly icon?: SymbolIcon;
  readonly label: string;
  readonly onPress?: () => void;
  readonly value: ReactNode;
};

/** A card's rows (a `Card.Rows` of `Card.Row`s), from their data. */
export const rowsOf = (rows: readonly RowData[]): ReactNode =>
  createElement(
    Card.Rows,
    null,
    rows.map(({ icon, label, onPress, value }) =>
      createElement(
        // (Its own props, keyed: its label its children.)
        Card.Row as ComponentType<
          Pick<CardRowProps, 'icon' | 'onClick' | 'value'> & { key: string }
        >,
        { icon, key: label, onClick: onPress, value },
        label,
      ),
    ),
  );

/**
 * A tile: a card's kind (its sizes), its size, the card in it; its size
 * expanded, if it expands (its grid item's `expandedSize`).
 */
export type Tile = {
  /** Room around its tile (a `Grid.Area`), its tile centered in it. */
  area?: GridSize;
  card: FunctionComponent;
  expandedSize?: GridSize;
  kind: keyof typeof cardSizes;
  name: string;
  /** Its size opened above the page (see `CameraCard`). */
  openSize?: GridOpenSize;
  size: GridSize;
  /** Its own sizes, instead of its kind's (see `cardSizes`). */
  sizes?: readonly GridSize[];
};

/** The lights (see `LightsCard`): on or off by name, in a store of the page's. */
export type Lights = Readonly<Record<string, boolean>>;
export const lightsStore = (() => {
  let lights: Lights = {
    'Ceiling Light': true,
    'Desk Lamp': false,
    'Floor Lamp': true,
  };
  const listeners = new Set<() => void>();
  return {
    get: () => lights,
    set: (name: string, isOn: boolean) => {
      lights = { ...lights, [name]: isOn };
      for (const listener of listeners) listener();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
})();
export const useLights = (): Lights =>
  useSyncExternalStore(lightsStore.subscribe, lightsStore.get);

/**
 * The card whose settings are shown (see `SettingsButton`): its name, in a
 * store of the page's, as its settings page is another page.
 */
export const settingsStore = (() => {
  let name = '';
  const listeners = new Set<() => void>();
  return {
    get: () => name,
    set: (next: string) => {
      name = next;
      for (const listener of listeners) listener();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
})();
export const useSettingsTarget = (): string =>
  useSyncExternalStore(settingsStore.subscribe, settingsStore.get);

/** A size's columns and rows (a full width's columns: as many as fit, 4). */
export const spanOf = (size: GridSize): readonly [number, number] => {
  const [columns = '1', rows = '1'] = size.split('x');
  return [columns === '*' ? 4 : Number(columns), Number(rows)];
};

/**
 * Whether its card shows its large layout: its tile at least 2x2, however
 * it got there (expanded, or resized in edit mode), or open above the page.
 */
export const useIsLarge = (): boolean => {
  const item = useGridItem();
  if (!item) return false;
  const [columns, rows] = spanOf(item.size);
  return item.open || (columns >= 2 && rows >= 2);
};

/**
 * The cards' glass context, for all of them (the page's tone switch, see
 * `CardsApp`): none, the color scheme's.
 */
export const CardToneContext = createContext<GlassContextValue | undefined>(
  undefined,
);

/** A card (`Card.Root`) in the page's tone (see `CardToneContext`). */
export const TonedCard: FunctionComponent<CardRootProps> = (props) =>
  createElement(Card.Root, {
    context: useContext(CardToneContext),
    ...props,
  });

/** A component in the page's tone (its `context`, see `CardToneContext`). */
const toned =
  <P extends { context?: CardRootProps['context'] }>(
    component: ComponentType<P>,
  ): FunctionComponent<P> =>
  (props) =>
    createElement(component, {
      context: useContext(CardToneContext),
      ...props,
    });

/** The library's control cards in the page's tone (see `toned`). */
export const Toned = {
  Button: toned(ControlCards.Button),
  Light: toned(ControlCards.Light),
  List: toned(ControlCards.List),
  Progress: toned(ControlCards.Progress),
  Segmented: toned(ControlCards.Segmented),
  Slider: toned(ControlCards.Slider),
  Stages: toned(ControlCards.Stages),
  State: toned(ControlCards.State),
  Switch: toned(ControlCards.Switch),
  Value: toned(ControlCards.Value),
};
