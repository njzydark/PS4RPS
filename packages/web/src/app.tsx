import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';

import { Provider } from '@/store/container';

import { WebAlert } from './components/WebAlert';
import { useRouterElement } from './routes';

export const App = () => {
  const RoutesElement = useRouterElement();
  return (
    <ConfigProvider locale={enUS}>
      <WebAlert />
      <Provider>{RoutesElement}</Provider>
    </ConfigProvider>
  );
};
