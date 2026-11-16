import { FunctionComponent, ReactNode } from 'react';

import {
  Grid,
  Switch,
  useGridArea,
  useGridItem,
} from '../../components/index.js';

// What the Grid pages share (see grid.tsx, grid-playground.tsx): a tile,
// a section header, a section's dense switch.

/**
 * A name breakable with a hyphen anywhere in its long words (more than 10
 * letters, soft hyphens between them): broken with a dash where it doesn't
 * fit, however narrow, whether a dictionary knows the word or not. Shorter
 * words wrap at their spaces as usual.
 */
const breakable = (label: string) =>
  label.replaceAll(/\p{L}{11,}/gu, (word) => [...word].join('\u00AD'));

/**
 * A tile shows its name and size (and the size asked for, if the grid gave
 * it a different one), and its place in its section's order (spacers and
 * breaks counted too; from 1). In edit mode its corner resizes it.
 */
export const Tile: FunctionComponent<{ label: string; place: number }> = ({
  label,
  place,
}) => {
  const item = useGridItem();
  const area = useGridArea();
  return (
    <>
      <div className="kitchen-sink-grid-tile">
        <span>{breakable(label)}</span>
        <span className="kitchen-sink-grid-tile-size">
          {item?.size}
          {item && item.size !== item.requested ? ` (${item.requested})` : ''}
          {area
            ? ` in ${area.size}${area.size === area.requested ? '' : ` (${area.requested})`}, ${area.placement}`
            : ''}
        </span>
        <span className="kitchen-sink-grid-tile-size">#{place + 1}</span>
      </div>
      <Grid.ResizeHandle />
    </>
  );
};

/** A section header: its title, a sentence on what to try, its buttons. */
export const SectionHeader: FunctionComponent<{
  children?: ReactNode;
  hint?: string;
  title: string;
}> = ({ children, hint, title }) => (
  <Grid.Header className="kitchen-sink-grid-header">
    <span className="kitchen-sink-grid-heading">
      <span className="kitchen-sink-grid-title">{title}</span>
      {hint ? <span className="kitchen-sink-grid-hint">{hint}</span> : null}
    </span>
    {children}
  </Grid.Header>
);

/**
 * A section's dense switch, labeled (unless its title says it). Dense
 * placement is off while editing, so the switch is too.
 */
export const DenseSwitch: FunctionComponent<{
  checked: boolean;
  disabled: boolean;
  isLabeled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ checked, disabled, isLabeled = true, onCheckedChange }) => (
  <span className="kitchen-sink-grid-dense">
    {isLabeled ? <span aria-hidden="true">Dense</span> : null}
    <Switch.Root
      aria-label="Dense"
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
    >
      <Switch.Thumb />
    </Switch.Root>
  </span>
);
