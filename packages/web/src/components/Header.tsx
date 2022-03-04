import { Button, Link, Modal, Space } from '@arco-design/web-react';
import { IconInfoCircle, IconSettings } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';

// @ts-ignore
import Icon from '@/assets/icon.png';

import pkg from '../../package.json';
import styles from './Header.module.less';
import { ToggleDarkMode } from './ToggleDarkMode';

const LinkUrl = 'https://github.com/njzydark/PS4RPS';

export const Header = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [appInfo, setAppInfo] = useState<{
    version: string;
    name: string;
    path: string;
  }>();

  useEffect(() => {
    const getAppInfo = async () => {
      if (!window.electron) {
        return;
      }
      const appInfo = await window.electron.getAppInfo();
      if (appInfo) {
        setAppInfo(appInfo);
      }
    };

    if (window.electron) {
      getAppInfo();
    } else {
      setAppInfo({
        name: 'PS4RPS',
        version: pkg.version,
        path: ''
      });
    }
  }, []);

  const handleOpenLink = () => {
    if (window.electron) {
      window.electron.openExternal(LinkUrl);
    } else {
      window.open(LinkUrl);
    }
  };

  return (
    <>
      <div className={styles['header-wrapper']}>
        <h2>PS4 Remote PKG Sender</h2>
        <Space>
          <Button type="default" icon={<IconInfoCircle />} onClick={() => setInfoVisible(true)} />
          {/* <Button type="default" icon={<IconSettings />} /> */}
          <ToggleDarkMode />
        </Space>
      </div>
      <Modal title="Info" footer={null} visible={infoVisible} onCancel={() => setInfoVisible(false)}>
        {appInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={Icon} width={120} />
            <h3>{appInfo?.name}</h3>
            <div>{appInfo?.version}</div>
            <Link onClick={handleOpenLink}>{LinkUrl}</Link>
          </div>
        )}
      </Modal>
    </>
  );
};
