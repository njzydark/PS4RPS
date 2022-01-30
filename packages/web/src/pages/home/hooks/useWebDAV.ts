import { useEffect, useRef, useState } from 'react';
import { AuthType, createClient, WebDAVClient } from 'webdav/web';

import { FileStat, ServerInfo } from '@/types';

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

export const useWebDAV = () => {
  const webDavClient = useRef<WebDAVClient>();

  const [servers, setServers] = useState<ServerInfo[]>(initialServers);
  const [curSelectServerId, setCurSelectServerId] = useState(initialServers[0].id);

  const [data, setData] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

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

  return {
    servers,
    setServers,
    curSelectServerId,
    setCurSelectServerId,
    data,
    loading,
    getData,
    webDavClient
  };
};