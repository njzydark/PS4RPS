import { Notification } from '@arco-design/web-react';
import { getPs4PkgInfo, Ps4PkgParamSfo } from '@njzy/ps4-pkg-info/web';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient, WebDAVClient } from 'webdav/web';

import { FileServerHost, FileServerType, FileStat } from '@/types';
import { getInitConfigFromStore, sortServerFiles, updateConfigStore } from '@/utils';

export const useFileServer = ({ forceWebDavDownloadLinkToHttp }: { forceWebDavDownloadLinkToHttp?: boolean }) => {
  const [isFileServerReady, setIsFileServerReady] = useState(true);

  const webDavClient = useRef<WebDAVClient>();

  const [fileServerHosts, setFileServerHosts] = useState<FileServerHost[]>(() =>
    getInitConfigFromStore('fileServerHosts', [])
  );

  const [curFileServerHostId, setCurFileServerHostId] = useState<string | undefined>(() =>
    getInitConfigFromStore('curFileServerHostId', undefined)
  );

  const curHost = useMemo(() => {
    const curHost = fileServerHosts.find(host => host.id === curFileServerHostId);
    if (curHost?.type === FileServerType.WebDAV) {
      webDavClient.current = createClient(curHost.url, curHost.options);
    }
    return curHost;
  }, [fileServerHosts, curFileServerHostId]);

  useEffect(() => {
    updateConfigStore('fileServerHosts', fileServerHosts);
    updateConfigStore('curFileServerHostId', curFileServerHostId);
  }, [curFileServerHostId, fileServerHosts]);

  const [searchKeyWord, setSearchKeyWord] = useState('');

  const [cachePkgInfoData, setCachePkgInfoData] = useState<
    { name: string; icon0?: string; paramSfo?: Ps4PkgParamSfo }[]
  >([]);

  const [fileServerFiles, setFileServerFiles] = useState<FileStat[]>([]);

  const [paths, setPaths] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const getWebDavPkgFileInfo = async (data: FileStat[]) => {
    try {
      const promises = data.map(async item => {
        try {
          const res = await getPs4PkgInfo(item.downloadUrl!, { generateBase64Icon: true });
          if (res) {
            const newData = {
              name: item.basename,
              icon0: res.icon0,
              paramSfo: res.paramSfo
            };
            setCachePkgInfoData(pre => {
              const curCache = cachePkgInfoData.find(cache => cache.name === item.basename);
              if (curCache) {
                Object.assign(curCache, newData);
                return [...pre];
              } else {
                pre.push(newData);
              }
              return [...pre];
            });
          }
        } catch (err) {
          return;
        }
      });
      await Promise.all(promises);
    } catch (err) {
      console.error('getWebDavPkgFileInfo', err);
    }
  };

  const getFilesApi = async (curHost: FileServerHost, webDavClient?: WebDAVClient, path = '/') => {
    let res: FileStat[] = [];
    if (curHost.type === FileServerType.WebDAV && webDavClient) {
      res = (await webDavClient.getDirectoryContents(path)) as FileStat[];
      if (res.length) {
        res.map(item => {
          const curCache = cachePkgInfoData.find(cache => cache.name === item.basename);
          if (curCache) {
            item.icon0 = curCache.icon0;
            item.paramSfo = curCache.paramSfo;
          }
          item.downloadUrl = item.type === 'file' ? webDavClient.getFileDownloadLink(item.filename) : '';
          if (forceWebDavDownloadLinkToHttp && item.downloadUrl.startsWith('https://')) {
            item.downloadUrl = item.downloadUrl.replace('https://', 'http://');
          }
        });
      }
    } else {
      const { data } = await axios.get(`${curHost?.url}/api/files?path=${encodeURI(path)}`);
      res = data || [];
    }
    return sortServerFiles(res);
  };

  let didCancel = false;

  const getServerFileListData = async (newPath = paths.join('/')) => {
    if (!curHost) {
      return;
    }
    try {
      setLoading(true);
      const res = await getFilesApi(curHost, webDavClient?.current, newPath);
      if (!didCancel) {
        if (curHost.type === FileServerType.WebDAV) {
          getWebDavPkgFileInfo(res.filter(item => !item.icon0 && item.downloadUrl));
        }
        setFileServerFiles(res || []);
      }
    } catch (err) {
      if (!didCancel) {
        if (err instanceof Error) {
          Notification.error({
            title: 'Get file server files error',
            content: err.message
          });
        }
      }
    } finally {
      if (!didCancel) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!curHost) {
      setLoading(false);
      setPaths([]);
      setFileServerFiles([]);
      return;
    }

    getServerFileListData();

    return () => {
      didCancel = true;
    };
  }, [paths, curHost]);

  useEffect(() => {
    if (cachePkgInfoData.length) {
      setFileServerFiles(pre => {
        return pre.map(item => {
          const curCache = cachePkgInfoData.find(cache => cache.name === item.basename);
          if (curCache) {
            item.icon0 = curCache.icon0;
            item.paramSfo = curCache.paramSfo;
          }
          return item;
        });
      });
    }
  }, [cachePkgInfoData]);

  return {
    webDavClient,
    fileServerHosts,
    setFileServerHosts,
    curFileServerHostId,
    setCurFileServerHostId,
    searchKeyWord,
    setSearchKeyWord,
    isFileServerReady,
    setIsFileServerReady,
    fileServerFiles,
    setFileServerFiles,
    loading,
    setLoading,
    paths,
    setPaths,
    getServerFileListData
  };
};
