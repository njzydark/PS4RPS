import { Alert } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

const CacheKey = 'WebAlertV1';

export const WebAlert = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cache = localStorage.getItem(CacheKey) === 'true';
    setVisible(cache ? false : true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(CacheKey, 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert
      onClose={handleClose}
      closable
      style={{ marginBottom: 10 }}
      type="info"
      content={
        <>
          <span>
            This Web version is mainly used to install files in WebDAV Server (NAS), and you must install&nbsp;
          </span>
          <a
            href="https://github.com/njzydark/ps4_remote_pkg_installer-OOSDK/releases"
            target="_blank"
            rel="noreferrer"
          >
            this version of RPI
          </a>
          <span>&nbsp;on your PS4</span>
        </>
      }
    />
  );
};
