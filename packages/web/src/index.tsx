import './index.less';

import { render } from 'react-dom';

import { App } from './app';
const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

render(<App />, rootEl);
