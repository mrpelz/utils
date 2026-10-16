import type { Properties } from 'csstype';

export type FocusHandler<E> = ((event: E) => void) | undefined;

export type HalfProps = {
  /**
   * The cursor (where the pointer hovers).
   * @default 'pointer' (disabled: 'not-allowed')
   */
  cursor?: Properties['cursor'];
};
