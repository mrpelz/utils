import { setup } from 'goober';
import { createElement } from 'react';
import { render } from 'react-dom';

import { Demo } from './demo/main.js';

setup(createElement);

if (module.hot) module.hot.accept();

render(<Demo />, document.body);
