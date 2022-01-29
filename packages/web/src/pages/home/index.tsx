import { useEffect, useRef, useState } from 'react';
import { AuthType, createClient, FileStat as RawFileStat, WebDAVClient, WebDAVClientOptions } from 'webdav/web';

import { Divider } from '@/components/Divider';
import { GameList } from '@/components/GameList';
import { PS4Host } from '@/components/PS4Host';
import { WebDavHost } from '@/components/WebDavHost';
import { usePS4 } from '@/hooks/usePS4';

import styles from './index.module.less';

export type FileStat = RawFileStat & {
  downloadUrl?: string;
};

export type ServerInfo = {
  id: string;
  alias?: string;
  url: string;
  options?: WebDAVClientOptions;
};

const initialServers: ServerInfo[] = [
  {
    id: '0',
    url: 'http://192.168.0.106:5070',
    options: {
      authType: AuthType.Password,
      username: 'admin',
      password: '123456'
    }
  }
];

export const Home = () => {
  const [data, setData] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

  const [servers, setServers] = useState<ServerInfo[]>(initialServers);
  const [curSelectServerId, setCurSelectServerId] = useState(initialServers[0].id);

  const webDavClient = useRef<WebDAVClient>();

  const getData = async () => {
    try {
      if (!webDavClient.current) {
        return;
      }
      setLoading(true);
      const res = await webDavClient.current.getDirectoryContents('/');
      setData(res as FileStat[]);
    } catch (err) {
      setData([]);
      setLoading(false);
      if (err instanceof Error) {
        console.log(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const curServer = servers.find(server => server.id === curSelectServerId);
    if (curServer) {
      webDavClient.current = createClient(curServer.url, curServer.options);
    }
    getData();
  }, [curSelectServerId, servers]);

  useEffect(() => {
    getData();
  }, []);

  const curServer = servers.find(server => server.id === curSelectServerId);
  const { handleInstall, installingData, ps4BaseUrls, curSelectPS4BaseUrl, setPs4BaseUrls, setCurSelectPS4BaseUrl } =
    usePS4(curServer?.url);

  const handleDownload = async (file: FileStat) => {
    if (webDavClient.current) {
      file.downloadUrl = webDavClient.current.getFileDownloadLink(file.filename);
      handleInstall(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>PS4 Remote PKG Installer</h2>
        <Divider />
        <WebDavHost
          servers={servers}
          curSelectServerId={curSelectServerId}
          changeServers={setServers}
          changeCurSelectServerId={setCurSelectServerId}
          handleRefresh={getData}
        />
        <Divider />
        <PS4Host
          ps4BaseUrls={ps4BaseUrls}
          curSelectPS4BaseUrl={curSelectPS4BaseUrl}
          changePs4Urls={setPs4BaseUrls}
          changeCurSelectPS4BaseUrl={setCurSelectPS4BaseUrl}
        />
        <Divider />
      </div>
      <div className={styles.content}>
        <GameList data={data} handleDownload={handleDownload} loading={loading} />
      </div>
    </div>
  );
};
