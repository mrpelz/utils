// (The demo layer first, see shared/style.css.)
import './demo/shared/style.css';
import './demo/frame/style.css';
import './demo/guide/style.css';
import './styles.css';

import hydrate from 'preact-iso/hydrate';

import { Demo } from './demo/main.js';

if (module.hot) module.hot.accept();

hydrate(<Demo />, document.body);
