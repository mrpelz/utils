import './utils/style.css';
import '../styles.css';

import { render } from 'react-dom';

import { Demo } from './index.js';

if (module.hot) module.hot.accept();

render(<Demo />, document.body);
