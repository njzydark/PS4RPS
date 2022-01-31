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
import { FileStat, InstallTask, PS4Host, TaskActionType, TaskStatus } from '@/types';

const initialPs4Hosts: PS4Host[] = [
  {
    id: '1',
    url: 'http://192.168.123.43:12800',
    alias: 'PS4-1'
  }
];

export const usePS4Installer = (webDavHostUrl?: string) => {
  const [ps4Hosts, setPs4Hosts] = useState<PS4Host[]>(initialPs4Hosts);
  const [curSelectPs4HostId, setCurSelectPs4HostId] = useState(initialPs4Hosts[0].id);
  const [installTasks, setInstallTasks] = useState<InstallTask[]>([]);

  const curPs4Host = ps4Hosts.find(item => item.id === curSelectPs4HostId);

  useEffect(() => {
    if (curPs4Host?.url) {
      changeBaseUrl(curPs4Host.url);
    }
  }, [curPs4Host?.url]);

  const handleInstall = async (file: FileStat) => {
    try {
      if (!curPs4Host?.url) {
        throw new Error(`PS4 host url not found`);
      }
      if (!webDavHostUrl) {
        throw new Error(`WebDAV host url not found`);
      }
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
      if (data.task_id && !installTasks.find(item => item.taskId === data.task_id)) {
        installTasks.unshift({
          file,
          taskId: data.task_id,
          title: data.title,
          ps4HostUrl: curPs4Host.url,
          webDavHostUrl,
          status: TaskStatus.INSTALLING
        });
        setInstallTasks([...installTasks]);
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
    console.log('installTasks', installTasks);

    const needCheckInstallTasks = installTasks.filter(item => item.status === TaskStatus.INSTALLING);

    if (!needCheckInstallTasks.length) {
      return;
    }

    let didCheckProgressCacncel = false;

    const checkProgress = async () => {
      const promises = needCheckInstallTasks.map(async item => {
        try {
          const { data } = await getTaskProgressApi(item.taskId);
          const percent = data.length_total ? (data.transferred_total / data.length_total) * 100 : 0;
          data._percent = percent >= 100 ? 100 : Number(percent.toFixed(0) || 0);
          return {
            taskId: item.taskId,
            status: data._percent === 100 ? TaskStatus.FINISHED : TaskStatus.INSTALLING,
            progressInfo: data
          };
        } catch (err) {
          return {
            taskId: item.taskId,
            status: TaskStatus.PAUSED,
            errorMessage: (err as Error).message
          };
        }
      });
      const res = await Promise.all(promises);
      if (!didCheckProgressCacncel) {
        setInstallTasks(pre => {
          const newInstallTasks = pre.reduce<InstallTask[]>((acc, cur) => {
            const curProgressInfo = res.find(item => item.taskId === cur.taskId);
            if (curProgressInfo) {
              acc.push({ ...cur, ...curProgressInfo });
            } else {
              acc.push(cur);
            }
            return acc;
          }, []);
          return newInstallTasks;
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
  }, [installTasks]);

  const handleChangeInstallTaskStatus = async (installTask: InstallTask, actionType: TaskActionType) => {
    try {
      if (actionType === TaskActionType.DELETE) {
        setInstallTasks(pre => pre.filter(item => item.taskId !== installTask.taskId));
        return;
      }
      const { data } = await (actionType === TaskActionType.PAUSE
        ? pauseApi(installTask.taskId)
        : actionType === TaskActionType.RESUME
        ? resumeApi(installTask.taskId)
        : cancelApi(installTask.taskId));
      if (data.status === 'success') {
        setInstallTasks(pre => {
          const cur = installTasks.find(item => item.taskId === installTask.taskId);
          if (cur) {
            cur.status =
              actionType === TaskActionType.PAUSE
                ? TaskStatus.PAUSED
                : actionType === TaskActionType.RESUME
                ? TaskStatus.INSTALLING
                : cur.status;
          }
          if (actionType === TaskActionType.CANCEL) {
            return pre.filter(item => item.taskId !== installTask.taskId);
          } else {
            return [...pre];
          }
        });
        Notification.success({
          title: installTask.title,
          content: `${actionType} success`
        });
      } else {
        if (data.status === 'fail') {
          throw new Error(String(data.error_code || 'not found error code'));
        }
      }
    } catch (err) {
      Notification.error({
        title: installTask.title,
        content: `${actionType} failed: ${(err as Error).message}`
      });
    }
  };

  return {
    installTasks,
    handleInstall,
    ps4Hosts,
    curSelectPs4HostId,
    setPs4Hosts,
    setCurSelectPs4HostId,
    handleChangeInstallTaskStatus
  };
};
