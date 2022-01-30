import { Divider } from '@/components/Divider';

import { GameList } from './components/GameList';
import { PS4Host } from './components/PS4Host';
import { WebDavHost } from './components/WebDavHost';
import { Provider } from './container';
import styles from './index.module.less';

export const Home = () => {
  return (
    <Provider>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>PS4 Remote PKG Installer</h2>
          <Divider />
          <WebDavHost />
          <Divider />
          <PS4Host />
          <Divider style={{ marginBottom: 0 }} />
        </div>
        <div className={styles.content}>
          <GameList />
        </div>
      </div>
    </Provider>
  );
};
