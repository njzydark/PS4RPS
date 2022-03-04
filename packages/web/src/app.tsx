import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cs from 'classnames';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { TitleBar } from './components/TitleBar';
import { NotFound } from './pages/404';
import { Home } from './pages/home';

export const App = () => {
  const showCuatomScrollBar = window.electron && window.electron.platform !== 'darwin';
  const showCustomTitleBar = false;

  return (
    <div
      className={cs(
        'global-app-wrapper',
        showCuatomScrollBar && 'custom-scroll-bar',
        showCustomTitleBar && 'custom-title-bar'
      )}
    >
      <ConfigProvider locale={enUS}>
        {showCustomTitleBar && <TitleBar />}
        <div className="window-content-wrapper">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </div>
      </ConfigProvider>
    </div>
  );
};
