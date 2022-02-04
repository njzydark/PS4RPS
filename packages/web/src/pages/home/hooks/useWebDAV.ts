import { Notification } from '@arco-design/web-react';
import { useEffect, useRef, useState } from 'react';
import { createClient, WebDAVClient } from 'webdav/web';

import { FileStat, WebDAVHost } from '@/types';
import { getInitConfigFromStore, updateConfigStore } from '@/utils';

const blackList = ['.DS_Store', '@eaDir', '._.DS_Store'];

export const useWebDAV = () => {
  const webDavClient = useRef<WebDAVClient>();

  const [webDavHosts, setWebDavHosts] = useState<WebDAVHost[]>(() => getInitConfigFromStore('webDavHosts', []));
  const [curSelectWebDavHostId, setCurSelectWebDavHostId] = useState<string | undefined>(
    getInitConfigFromStore('curSelectWebDavHostId', undefined)
  );

  const [webDavHostFiles, setWebDavHostFiles] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

  const [paths, setPaths] = useState<string[]>([]);

  const didCancel = useRef(false);

  const getWebDavHostFiles = async (path = '/') => {
    try {
      if (!webDavClient.current) {
        return;
      }
      didCancel.current = false;
      setLoading(true);
      const res = await webDavClient.current.getDirectoryContents(path);
      if (!didCancel.current) {
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
        didCancel.current = true;
      }
    } catch (err) {
      if (didCancel.current) {
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
      didCancel.current = true;
    }
  };

  useEffect(() => {
    const curHost = webDavHosts.find(host => host.id === curSelectWebDavHostId);
    if (curHost) {
      webDavClient.current = createClient(curHost.url, curHost.options);
    }
    getWebDavHostFiles(paths.join('/'));
  }, [curSelectWebDavHostId, webDavHosts, paths]);

  useEffect(() => {
    updateConfigStore('webDavHosts', webDavHosts);
    updateConfigStore('curSelectWebDavHostId', curSelectWebDavHostId);
  }, [curSelectWebDavHostId, webDavHosts]);

  const [searchKeyWord, setSearchKeyWord] = useState('');

  return {
    webDavHosts,
    setWebDavHosts,
    curSelectWebDavHostId,
    setCurSelectWebDavHostId,
    webDavHostFiles,
    loading,
    getWebDavHostFiles,
    webDavClient,
    paths,
    setPaths,
    searchKeyWord,
    setSearchKeyWord
  };
};
