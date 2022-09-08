import './index.less';

import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

const Router = HashRouter;

import { App } from './app';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

render(
  <Router>
    <App />
  </Router>,
  rootEl
);
