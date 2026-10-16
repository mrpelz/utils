import type { IconDefinition } from '@bradleyhodges/sfsymbols-types';
import type { ComponentProps } from 'react';

export type SymbolProps = ComponentProps<'span'> & {
  /**
   * The SF Symbol (from `@bradleyhodges/sfsymbols`, e.g. `sfBell`; a peer
   * dependency, mind Apple's terms for SF Symbols).
   */
  icon: IconDefinition;
};
