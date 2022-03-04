import { Divider } from '@/components/Divider';
import { Header } from '@/components/Header';
import { WebAlert } from '@/components/WebAlert';

import { FileServerFilesList } from './components/FileServerFilesList';
import { FileServerHost } from './components/FileServerHost';
import { PS4Host } from './components/PS4Host';
import { Provider } from './container';
import styles from './index.module.less';

export const Home = () => {
  return (
    <Provider>
      <div className={styles.wrapper}>
        <div className={styles.hostConfigWrapper}>
          {!window.electron && <WebAlert />}
          <Header />
          <Divider />
          <PS4Host />
          <Divider />
          <FileServerHost />
        </div>
        <div className={styles.fileListWrapper}>
          <FileServerFilesList />
        </div>
      </div>
    </Provider>
  );
};
