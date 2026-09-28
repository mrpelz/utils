import { setup } from 'goober';
import { h, render } from 'preact';

import { Demo } from './demo/main.js';

setup(h);

if (module.hot) module.hot.accept();

render(<Demo />, document.body);
