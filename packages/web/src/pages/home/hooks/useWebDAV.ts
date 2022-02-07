import { Notification } from '@arco-design/web-react';
import { useEffect, useRef, useState } from 'react';
import { createClient, WebDAVClient } from 'webdav/web';

import { FileStat, WebDAVHost } from '@/types';
import { getInitConfigFromStore, updateConfigStore } from '@/utils';

const blackList = ['.DS_Store', '@eaDir', '._.DS_Store'];

export const useWebDAV = () => {
  const webDavClient = useRef<WebDAVClient>();
  const [isWebDavServerReady, setIsWebDavServerReady] = useState(true);

  const [webDavHosts, setWebDavHosts] = useState<WebDAVHost[]>(() => getInitConfigFromStore('webDavHosts', []));
  const [curSelectWebDavHostId, setCurSelectWebDavHostId] = useState<string | undefined>(() =>
    getInitConfigFromStore('curSelectWebDavHostId', undefined)
  );

  const [webDavHostFiles, setWebDavHostFiles] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

  const [paths, setPaths] = useState<string[]>([]);

  let didCancel = false;

  const getWebDavHostFiles = async (path = '/') => {
    try {
      if (!webDavClient.current) {
        return;
      }
      didCancel = false;
      setLoading(true);
      const res = await webDavClient.current.getDirectoryContents(path);
      if (didCancel) {
        return;
      }
      const newData =
        (res as FileStat[])?.filter(item => {
          if (item.type === 'directory' && !blackList.includes(item.basename)) {
            return true;
          } else if (item.type === 'file' && item.basename.endsWith('.pkg')) {
            return true;
          } else {
            return false;
          }
        }) || [];
      setWebDavHostFiles(newData);
      setLoading(false);
    } catch (err) {
      if (didCancel) {
        return;
      }
      setWebDavHostFiles([]);
      setLoading(false);
      if (err instanceof Error) {
        Notification.error({
          title: 'Get WebDav Host Files Error',
          content: err.message
        });
      }
    }
  };

  useEffect(() => {
    const curHost = webDavHosts.find(host => host.id === curSelectWebDavHostId);
    if (curHost) {
      webDavClient.current = createClient(curHost.url, curHost.options);
    }
  }, [curSelectWebDavHostId, webDavHosts, paths]);

  useEffect(() => {
    if (isWebDavServerReady) {
      getWebDavHostFiles(paths.join('/'));
    }
    return () => {
      didCancel = true;
    };
  }, [paths, isWebDavServerReady]);

  useEffect(() => {
    updateConfigStore('webDavHosts', webDavHosts);
    updateConfigStore('curSelectWebDavHostId', curSelectWebDavHostId);
  }, [curSelectWebDavHostId, webDavHosts]);

  const [searchKeyWord, setSearchKeyWord] = useState('');

  return {
    webDavClient,
    webDavHosts,
    setWebDavHosts,
    curSelectWebDavHostId,
    setCurSelectWebDavHostId,
    webDavHostFiles,
    setWebDavHostFiles,
    getWebDavHostFiles,
    loading,
    setLoading,
    paths,
    setPaths,
    searchKeyWord,
    setSearchKeyWord,
    isWebDavServerReady,
    setIsWebDavServerReady
  };
};
