import {
  createContext,
  createElement,
  FunctionComponent,
  useContext,
  useSyncExternalStore,
} from 'react';

import {
  Card,
  type CardRootProps,
  cardSizes,
  type GlassContextValue,
  type GridSize,
  useGridItem,
} from '../../components/index.js';

// What the Cards pages share (see cards.tsx, more-cards.tsx): a tile's
// shape, a card's expansion, the lights' store.

/**
 * A card's expansion (see `CardsApp`): whether it's expanded (the app's
 * state, not stored), and asking for the other.
 */
export type Expansion = { isExpanded: boolean; onToggle: () => void };

/**
 * A tile: a card's kind (its sizes), its size, the card in it; its size
 * expanded, if it expands (see `Expansion`).
 */
export type Tile = {
  /** Room around its tile (a `Grid.Area`), its tile centered in it. */
  area?: GridSize;
  card: FunctionComponent<{ expansion?: Expansion }>;
  expandedSize?: GridSize;
  kind: keyof typeof cardSizes;
  name: string;
  /** Its size opened above the page (see `CameraCard`). */
  openSize?: GridSize;
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
