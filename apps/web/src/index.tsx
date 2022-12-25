import './index.less';

import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

const Router = HashRouter;

import { App } from './app';
import { CustomErrorBoundary } from './components/CustomErrorBoundary';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

render(
  <CustomErrorBoundary title="Global Error message" showDialog>
    <Router>
      <App />
    </Router>
  </CustomErrorBoundary>,
  rootEl
);
