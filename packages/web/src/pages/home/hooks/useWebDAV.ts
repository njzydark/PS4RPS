import { useEffect, useRef, useState } from 'react';
import { AuthType, createClient, WebDAVClient } from 'webdav/web';

import { FileStat, WebDAVHost } from '@/types';

const initialWebDavHosts: WebDAVHost[] = [
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

  const [webDavHosts, setWebDavHosts] = useState<WebDAVHost[]>(initialWebDavHosts);
  const [curSelectWebDavHostId, setCurSelectWebDavHostId] = useState(initialWebDavHosts[0].id);

  const [webDavHostFiles, setWebDavHostFiles] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

  const didCancel = useRef(false);

  const getWebDavHostFiles = async () => {
    try {
      if (!webDavClient.current) {
        return;
      }
      didCancel.current = false;
      setLoading(true);
      const res = await webDavClient.current.getDirectoryContents('/');
      if (!didCancel.current) {
        setWebDavHostFiles(res as FileStat[]);
        setLoading(false);
        didCancel.current = true;
      }
    } catch (err) {
      if (didCancel.current) {
        return;
      }
      setWebDavHostFiles([]);
      setLoading(false);
      if (err instanceof Error) {
        console.log(err.message);
      }
      didCancel.current = true;
    }
  };

  useEffect(() => {
    const curHost = webDavHosts.find(host => host.id === curSelectWebDavHostId);
    if (curHost) {
      webDavClient.current = createClient(curHost.url, curHost.options);
    }
    getWebDavHostFiles();
  }, [curSelectWebDavHostId, webDavHosts]);

  useEffect(() => {
    getWebDavHostFiles();
  }, []);

  return {
    webDavHosts,
    setWebDavHosts,
    curSelectWebDavHostId,
    setCurSelectWebDavHostId,
    webDavHostFiles,
    loading,
    getWebDavHostFiles,
    webDavClient
  };
};
