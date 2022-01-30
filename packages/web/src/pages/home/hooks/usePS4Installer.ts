import { Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { changeBaseUrl, getTaskProgress, installApi, InstallParams, InstallType } from '@/service/ps4';
import { FileStat } from '@/types';

type InstallingData = {
  file: FileStat;
  taskId: number;
  ps4BaseUrl: string;
  installBaseUrl: string;
};

const initialUrls = ['http://192.168.0.118:12800/api'];

export const usePS4 = (installBaseUrl?: string) => {
  const [ps4BaseUrls, setPs4BaseUrls] = useState(initialUrls);
  const [curSelectPS4BaseUrl, setCurSelectPS4BaseUrl] = useState(initialUrls[0]);
  const [installingData, setInstallingData] = useState<InstallingData[]>([]);

  useEffect(() => {
    changeBaseUrl(curSelectPS4BaseUrl);
  }, [curSelectPS4BaseUrl]);

  const handleInstall = async (file: FileStat) => {
    try {
      if (!file.downloadUrl) {
        throw new Error(`${file.basename} download url not found`);
      }
      if (!installBaseUrl) {
        throw new Error(`Install url not found`);
      }
      const packageUrl = file.downloadUrl;
      const params: InstallParams<InstallType.DIRECT> = {
        type: InstallType.DIRECT,
        packages: [packageUrl]
      };
      const { data } = await installApi(params);
      if (typeof data === 'string') {
        throw new Error('Install failed');
      }
      if (data.task_id) {
        setInstallingData([
          {
            file,
            taskId: data.task_id,
            ps4BaseUrl: curSelectPS4BaseUrl,
            installBaseUrl
          }
        ]);
        Message.success(`Success: ${data.task_id}`);
      }
    } catch (err) {
      Message.error((err as Error).message);
    }
  };

  useEffect(() => {
    console.log('installingData', installingData);
    let timer: NodeJS.Timer;
    if (installingData.length > 0) {
      const cur = installingData[0];
      timer = setInterval(async () => {
        const res = await getTaskProgress(cur.taskId);
        if (res.data) {
          console.log(res.data);
        }
      }, 3000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [installingData]);

  return {
    installingData,
    handleInstall,
    ps4BaseUrls,
    curSelectPS4BaseUrl,
    setPs4BaseUrls,
    setCurSelectPS4BaseUrl
  };
};
