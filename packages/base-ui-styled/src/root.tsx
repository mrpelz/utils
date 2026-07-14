import { setup } from 'goober';
import { h, render } from 'preact';

import { Demo } from './demo/demo.js';
import { DemoFull } from './demo/demo-full.js';

setup(h);

// const App = DemoFull;
const App = Demo;

export const root = (): void => render(<App />, document.body);
