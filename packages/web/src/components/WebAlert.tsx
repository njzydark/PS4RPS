import { Alert, Link } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

const CacheKey = 'WebAlertV1';

const LinkUrl = 'https://github.com/njzydark/ps4_remote_pkg_installer-OOSDK/releases';

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
            This Web version is mainly used to install files in WebDAV Server (NAS), and you must install this version
            of&nbsp;
          </span>
          <Link
            hoverable={false}
            href="https://github.com/njzydark/ps4_remote_pkg_installer-OOSDK/releases"
            target="_blank"
          >
            RPI
          </Link>
          <span>&nbsp;on your PS4</span>
        </>
      }
    />
  );
};

export const RPILink = () => {
  const handleOpenLink = () => {
    if (window.electron) {
      window.electron.openExternal(LinkUrl);
    } else {
      window.open(LinkUrl);
    }
  };
  return (
    <Link hoverable={false} onClick={handleOpenLink}>
      RPI
    </Link>
  );
};
