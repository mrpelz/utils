import type { Properties } from 'csstype';

export type FocusHandler<E> = ((event: E) => void) | undefined;

export type HalfProps = {
  cursor?: Properties['cursor'];
};
