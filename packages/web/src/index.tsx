import './index.less';

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { render } from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { App } from './app';
import { NotFound } from './pages/404';
import { Home } from './pages/home';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

const RouterWrapper = () => {
  return (
    <ConfigProvider locale={enUS}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
};

render(<RouterWrapper />, rootEl);
