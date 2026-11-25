import { ReactNode } from 'react';

import { Card, type SymbolIcon } from '../../components/index.js';

/** A segmented card's option, as the page keeps it (its data). */
export type Segment = {
  disabled?: boolean;
  icon?: SymbolIcon;
  label: string;
  subtitle?: string;
  tint?: string;
  value: string;
};

/**
 * A segmented card's options from the page's data: an item each
 * (`Card.SegmentedItem`, composed as Segmented's items are), its
 * words its children.
 */
export const segmentsOf = (segments: readonly Segment[]): ReactNode =>
  segments.map(({ label, value, ...segment }) => (
    <Card.SegmentedItem
      key={value}
      value={value}
      {...segment}
    >
      {label}
    </Card.SegmentedItem>
  ));
