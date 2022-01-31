import { Notification } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import {
  cancelApi,
  changeBaseUrl,
  getTaskProgressApi,
  installApi,
  InstallParams,
  InstallType,
  pauseApi,
  resumeApi
} from '@/service/ps4';
import { FileStat, InstallingData, PS4Host, TaskActionType, TaskStatus } from '@/types';

const initialPs4Hosts: PS4Host[] = [
  {
    id: '1',
    url: 'http://192.168.123.43:12800',
    alias: 'PS4-1'
  }
];

export const usePS4Installer = (installBaseUrl?: string) => {
  const [ps4Hosts, setPs4Hosts] = useState<PS4Host[]>(initialPs4Hosts);
  const [curSelectPs4HostId, setCurSelectPs4HostId] = useState(initialPs4Hosts[0].id);
  const [installingData, setInstallingData] = useState<InstallingData[]>([]);

  useEffect(() => {
    const curPs4Host = ps4Hosts.find(item => item.id === curSelectPs4HostId);
    if (curPs4Host) {
      changeBaseUrl(curPs4Host.url);
    }
  }, [ps4Hosts, curSelectPs4HostId]);

  const handleInstall = async (file: FileStat) => {
    try {
      if (!file.downloadUrl) {
        throw new Error(`Download url not found`);
      }
      const params: InstallParams<InstallType.DIRECT> = {
        type: InstallType.DIRECT,
        packages: [file.downloadUrl]
      };
      const { data } = await installApi(params);
      if (typeof data === 'string') {
        // @ts-ignore
        throw new Error(data.trim());
      }
      if (data.task_id && !installingData.find(item => item.taskId === data.task_id)) {
        installingData.unshift({
          file,
          taskId: data.task_id,
          title: data.title,
          ps4BaseUrl: curSelectPs4HostId,
          installBaseUrl: installBaseUrl as string,
          status: TaskStatus.INSTALLING
        });
        setInstallingData([...installingData]);
        Notification.success({
          title: data.title || file.basename,
          content: `Start install`
        });
      }
    } catch (err) {
      Notification.error({
        title: `${file.basename} Install failed`,
        content: (err as Error).message
      });
    }
  };

  useEffect(() => {
    console.log('installingData', installingData);

    const needCheckInstallingData = installingData.filter(item => item.status === TaskStatus.INSTALLING);

    if (!needCheckInstallingData.length) {
      return;
    }

    let didCheckProgressCacncel = false;

    const checkProgress = async () => {
      const promises = needCheckInstallingData.map(async item => {
        try {
          const { data } = await getTaskProgressApi(item.taskId);
          const percent = data.length_total ? (data.transferred_total / data.length_total) * 100 : 0;
          data._percent = percent >= 100 ? 100 : Number(percent.toFixed(0) || 0);
          return {
            id: item.taskId,
            status: data._percent === 100 ? TaskStatus.FINISHED : TaskStatus.INSTALLING,
            progressInfo: data
          };
        } catch (err) {
          return {
            id: item.taskId,
            status: TaskStatus.PAUSED,
            errorMessage: (err as Error).message
          };
        }
      });
      const res = await Promise.all(promises);
      if (!didCheckProgressCacncel) {
        setInstallingData(pre => {
          const newInstallingData = pre.reduce<InstallingData[]>((acc, cur) => {
            const curProgressInfo = res.find(item => item.id === cur.taskId);
            if (curProgressInfo) {
              acc.push({ ...cur, ...curProgressInfo });
            } else {
              acc.push(cur);
            }
            return acc;
          }, []);
          return newInstallingData;
        });
      }
    };
    // checkProgress();

    let timer: number | undefined = undefined;

    timer = window.setInterval(checkProgress, 3000);

    return () => {
      didCheckProgressCacncel = true;
      clearInterval(timer);
    };
  }, [installingData]);

  const handleChangeInstallingItemStatus = async (installingItem: InstallingData, actionType: TaskActionType) => {
    try {
      if (actionType === TaskActionType.DELETE) {
        setInstallingData(pre => pre.filter(item => item.taskId !== installingItem.taskId));
        return;
      }
      const { data } = await (actionType === TaskActionType.PAUSE
        ? pauseApi(installingItem.taskId)
        : actionType === TaskActionType.RESUME
        ? resumeApi(installingItem.taskId)
        : cancelApi(installingItem.taskId));
      if (data.status === 'success') {
        setInstallingData(pre => {
          const cur = installingData.find(item => item.taskId === installingItem.taskId);
          if (cur) {
            cur.status =
              actionType === TaskActionType.PAUSE
                ? TaskStatus.PAUSED
                : actionType === TaskActionType.RESUME
                ? TaskStatus.INSTALLING
                : cur.status;
          }
          if (actionType === TaskActionType.CANCEL) {
            return pre.filter(item => item.taskId !== installingItem.taskId);
          } else {
            return [...pre];
          }
        });
        Notification.success({
          title: installingItem.title,
          content: `${actionType} success`
        });
      } else {
        if (data.status === 'fail') {
          throw new Error(String(data.error_code || 'not found error code'));
        }
      }
    } catch (err) {
      Notification.error({
        title: installingItem.title,
        content: `${actionType} failed: ${(err as Error).message}`
      });
    }
  };

  return {
    installingData,
    handleInstall,
    ps4Hosts,
    curSelectPs4HostId,
    setPs4Hosts,
    setCurSelectPs4HostId,
    handleChangeInstallingItemStatus
  };
};
