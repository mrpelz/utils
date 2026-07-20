import { setup } from 'goober';
import { h, render } from 'preact';

import { Demo } from './demo.js';

setup(h);

export const root = (): void => render(<Demo />, document.body);
