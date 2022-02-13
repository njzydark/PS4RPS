import { Notification } from '@arco-design/web-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { createClient, WebDAVClient } from 'webdav/web';

import { FileServerHost, FileServerType, FileStat } from '@/types';
import { getInitConfigFromStore, updateConfigStore } from '@/utils';

const blackList = ['.DS_Store', '@eaDir', '._.DS_Store'];

export const useFileServer = () => {
  const webDavClient = useRef<WebDAVClient>();
  const [isFileServerReady, setIsFileServerReady] = useState(true);

  const [fileServerHosts, setFileServerHosts] = useState<FileServerHost[]>(() =>
    getInitConfigFromStore('fileServerHosts', [])
  );
  const [curFileServerHostId, setCurFileServerHostId] = useState<string | undefined>(() =>
    getInitConfigFromStore('curFileServerHostId', undefined)
  );

  const [fileServerFiles, setFileServerFiles] = useState<FileStat[]>([]);
  const [loading, setLoading] = useState(false);

  const [paths, setPaths] = useState<string[]>([]);

  const curHost = fileServerHosts.find(host => host.id === curFileServerHostId);

  let didCancel = false;

  const getFileServerFiles = async (path = '/') => {
    try {
      if (!curHost) {
        return;
      }
      if (curHost.type === FileServerType.WebDAV && !webDavClient.current) {
        return;
      }
      didCancel = false;
      setLoading(true);

      let res: FileStat[] = [];
      if (curHost.type === FileServerType.WebDAV) {
        // @ts-ignore
        res = await webDavClient.current.getDirectoryContents(path);
      } else {
        const { data } = await axios.get(`${curHost?.url}/api/files?path=${path}`);
        res = data;
      }
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
      setFileServerFiles(newData);
      setLoading(false);
    } catch (err) {
      if (didCancel) {
        return;
      }
      setFileServerFiles([]);
      setLoading(false);
      if (err instanceof Error) {
        Notification.error({
          title: 'Get file server files error',
          content: err.message
        });
      }
    }
  };

  useEffect(() => {
    if (curHost?.type === FileServerType.WebDAV) {
      webDavClient.current = createClient(curHost.url, curHost.options);
    }
  }, [curFileServerHostId, fileServerHosts]);

  useEffect(() => {
    if (isFileServerReady) {
      getFileServerFiles(paths.join('/'));
    }
    return () => {
      didCancel = true;
    };
  }, [paths, isFileServerReady]);

  useEffect(() => {
    updateConfigStore('fileServerHosts', fileServerHosts);
    updateConfigStore('curFileServerHostId', curFileServerHostId);
  }, [curFileServerHostId, fileServerHosts]);

  const [searchKeyWord, setSearchKeyWord] = useState('');

  return {
    webDavClient,
    fileServerHosts,
    setFileServerHosts,
    curFileServerHostId,
    setCurFileServerHostId,
    fileServerFiles,
    setFileServerFiles,
    getFileServerFiles,
    loading,
    setLoading,
    paths,
    setPaths,
    searchKeyWord,
    setSearchKeyWord,
    isFileServerReady,
    setIsFileServerReady
  };
};
