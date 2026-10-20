/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** The root's options; `pop` pops the shown stack (see `NavigationDemo`). */
export const getPropOptionsRoot = (pop: () => void) => ({
  ...commonPropOptions,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});
