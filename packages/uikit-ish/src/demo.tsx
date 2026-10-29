// (The demo layer first, see demo/tooling/shared/style.css.)
import './demo/tooling/shared/style.css';
import './demo/tooling/frame/style.css';
import './demo/tooling/guide/style.css';
import './styles.css';
// Its icons and web app manifest (see demo/index.html).
import './demo/assets/main.js';

import hydrate from 'preact-iso/hydrate';

import { Demo } from './demo/tooling/main.js';

if (module.hot) module.hot.accept();

hydrate(<Demo />, document.body);
