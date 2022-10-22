import './index.less';
import 'core-js';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

const Router = HashRouter;

import { App } from './app';
import { CustomErrorBoundary } from './components/CustomErrorBoundary';

Sentry.init({
  dsn: 'https://b330b8f226c444769a43292c20048d3e@o477756.ingest.sentry.io/6749540',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
});

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
