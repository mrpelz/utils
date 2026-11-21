// (The demo layer first, see demo/tooling/shared/style.css.)
import './demo/tooling/shared/style.css';
import './demo/tooling/frame/style.css';
import './demo/tooling/guide/style.css';
import './styles.css';

import hydrate from 'preact-iso/hydrate';

import { iconsLoaded } from './demo/tooling/icons.js';
import { Demo } from './demo/tooling/main.js';

if (module.hot) module.hot.accept();

// (Once its icons are in, as when prerendered: see demo/tooling/icons.ts.)
iconsLoaded.then(() => hydrate(<Demo />, document.body)).catch(() => undefined);
