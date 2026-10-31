import type { ComponentProps } from 'react';
export type ClearProps = Omit<ComponentProps<'button'>, 'ref'> & {
  /**
   * When it's shown, always only while the field
   * is filled: while it's focused, while it isn't, or either way.
   * @default 'whileEditing'
   */
  mode?: 'always' | 'unlessEditing' | 'whileEditing';
};

/** A search field's look (see `SearchProps`). */
export type SearchVariant =
  'fill' | 'row' | 'tab-bar' | 'tab-bar-collapsed' | 'toolbar';

export type SearchProps = Omit<ComponentProps<'label'>, 'ref'> & {
  /**
   * Its look: a capsule on the tertiary fill; a list row's look (inset
   * grouped: its background, height and corners; not a row); a tab bar
   * group's glass capsule, as high as its tabs (e.g. beside a
   * `TabBar.Group`); or the collapsed tab bar's, no capsule of its own, on
   * the glass it's in (e.g. a `TabBar.Accessory`'s, filling it); or a
   * toolbar group's glass capsule, as high as its buttons (e.g. between a
   * `Toolbar`'s buttons).
   * @default 'fill'
   */
  variant?: SearchVariant;
};
