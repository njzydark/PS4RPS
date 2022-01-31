import { Divider } from '@/components/Divider';

import { PS4Host } from './components/PS4Host';
import { WebDavFileList } from './components/WebDavFileList';
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
          <PS4Host />
          <Divider />
          <WebDavHost />
        </div>
        <div className={styles.content}>
          <WebDavFileList />
        </div>
      </div>
    </Provider>
  );
};
