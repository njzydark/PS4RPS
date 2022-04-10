import cs from 'classnames';
import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import Logo from '@/assets/icon.png';
import { getNavTitleByPath, routeNavs } from '@/routes';
import { useContainer } from '@/store/container';

import styles from './Layout.module.less';
import { TitleBar } from './TitleBar';
import { ToggleDarkMode } from './ToggleDarkMode';

const SideBar = () => {
  const { settings } = useContainer();
  return (
    <nav className={cs('side-nav-wrapper', styles['side-nav-wrapper'])}>
      <h2 className={styles.header}>
        {settings.displayLogo && <img src={Logo} />}
        <span>RPS</span>
      </h2>
      <div className={styles.content}>
        {routeNavs.map(route => (
          <NavLink
            key={route.title}
            className={({ isActive }) => cs(styles['nav-link'], isActive && styles.active)}
            to={route.path}
          >
            {route.icon}
            {route.title}
          </NavLink>
        ))}
      </div>
      <div className={styles.footer}>
        <ToggleDarkMode />
      </div>
    </nav>
  );
};

const TitleHeader = () => {
  const location = useLocation();
  const title = getNavTitleByPath(location.pathname);

  return <h2 className={styles['title-header-wrapper']}>{title}</h2>;
};

export const Layout = () => {
  const showCuatomScrollBar = window.electron && window.electron.platform !== 'darwin';
  const showCustomTitleBar = false;

  const scrollEl = useRef<HTMLDivElement>(null);

  const location = useLocation();
  useEffect(() => {
    if (scrollEl.current) {
      scrollEl.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <div
      className={cs(
        'global-app-wrapper',
        showCuatomScrollBar && 'global-scroll-bar',
        showCustomTitleBar && 'global-title-bar'
      )}
    >
      {showCustomTitleBar && <TitleBar />}
      <div className={cs('global-content-wrapper', styles.wrapper)}>
        <SideBar />
        <main className={styles['main-content-wrapper']}>
          <TitleHeader />
          <div className={styles['content-wrapper']} ref={scrollEl}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
