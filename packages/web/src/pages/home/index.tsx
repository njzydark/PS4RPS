import { Divider } from '@/components/Divider';
import { Header } from '@/components/Header';

import { PS4Host } from './components/PS4Host';
import { WebDavFileList } from './components/WebDavFileList';
import { WebDavHost } from './components/WebDavHost';
import { Provider } from './container';
import styles from './index.module.less';

export const Home = () => {
  return (
    <Provider>
      <div className={styles.wrapper}>
        <div className={styles.hostConfigWrapper}>
          <Header />
          <Divider />
          <PS4Host />
          <Divider />
          <WebDavHost />
        </div>
        <div className={styles.fileListWrapper}>
          <WebDavFileList />
        </div>
      </div>
    </Provider>
  );
};
