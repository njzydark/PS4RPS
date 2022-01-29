import './index.less';

import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { App } from './app';
import { NotFound } from './pages/404';
import { About } from './pages/about';
import { Home } from './pages/home';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>,
  rootEl
);
