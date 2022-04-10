import { Button, Link } from '@arco-design/web-react';
import { IconGithub } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';

// @ts-ignore
import Icon from '@/assets/icon.png';

const LinkUrl = 'https://github.com/njzydark/PS4RPS';

export const Info = () => {
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
        version: _app_version,
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

  if (!appInfo) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleOpenLink}>
      <img style={{ flexShrink: 0 }} src={Icon} width={80} />
      <div style={{ flex: 1 }}>
        <h3>{appInfo?.name}</h3>
        <div>{appInfo?.version}</div>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <Link>
          If you love this software, please give me a star
          <IconGithub style={{ cursor: 'pointer', marginLeft: 12 }} />
        </Link>
        {window.electron && (
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Button
              size="small"
              onClick={e => {
                e.stopPropagation();
                window.electron?.checkUpdate();
              }}
            >
              Check Update
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
