import type { ComponentProps } from 'react';
export type ClearProps = Omit<ComponentProps<'button'>, 'ref'> & {
  /**
   * When it's shown (UIKit `clearButtonMode`), always only while the field
   * is filled: while it's focused, while it isn't, or either way.
   * @default 'whileEditing'
   */
  mode?: 'always' | 'unlessEditing' | 'whileEditing';
};
