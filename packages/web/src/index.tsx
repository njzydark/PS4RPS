import './index.less';

import { render } from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { App } from './app';
import { NotFound } from './pages/404';
import { Home } from './pages/home';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </HashRouter>,
  rootEl
);
