import { IconHome, IconSend, IconSettings, IconStorage } from '@arco-design/web-react/icon';
import { RouteObject, useRoutes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Hosts } from './pages/Hosts';
import { NotFound } from './pages/NotFound';
import { Settings } from './pages/Settings';
import { Tasks } from './pages/Tasks';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/hosts',
        element: <Hosts />
      },
      {
        path: '/tasks',
        element: <Tasks />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      { path: '*', element: <NotFound /> }
    ]
  }
];

export const useRouterElement = () => {
  return useRoutes(routes);
};

export const routeNavs = [
  {
    path: '/',
    icon: <IconHome />,
    title: 'Home'
  },
  {
    path: '/hosts',
    icon: <IconStorage />,
    title: 'Hosts'
  },
  {
    path: '/tasks',
    icon: <IconSend />,
    title: 'Tasks'
  },
  {
    path: '/settings',
    icon: <IconSettings />,
    title: 'Settings'
  }
];

export const getNavTitleByPath = (path: string) => {
  const nav = routeNavs.find(nav => nav.path === path);
  return nav ? nav.title : '';
};
