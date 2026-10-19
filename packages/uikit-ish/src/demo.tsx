import './demo/utils/style.css';
import './styles.css';

import hydrate from 'preact-iso/hydrate';

import { Demo } from './demo/main.js';

if (module.hot) module.hot.accept();

hydrate(<Demo />, document.body);
