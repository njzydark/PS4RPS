import './index.less';

import { render } from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const Router = window.electron ? HashRouter : BrowserRouter;

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
