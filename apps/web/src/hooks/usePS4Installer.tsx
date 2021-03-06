import { Link, Notification } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RPILink } from '@/components/WebAlert';
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
import { getInitConfigFromStore, updateConfigStore } from '@/utils';

export const usePS4Installer = (fileServerHostId?: string) => {
  const [ps4Hosts, setPs4Hosts] = useState<PS4Host[]>(() => getInitConfigFromStore('ps4Hosts', []));
  const [curSelectPs4HostId, setCurSelectPs4HostId] = useState<string | undefined>(() =>
    getInitConfigFromStore('curSelectPs4HostId', undefined)
  );
  const [installTasks, setInstallTasks] = useState<InstallTask[]>([]);

  const curPs4Host = ps4Hosts.find(item => item.id === curSelectPs4HostId);

  useEffect(() => {
    if (curPs4Host?.url) {
      changeBaseUrl(curPs4Host.url);
    }
  }, [curPs4Host?.url]);

  useEffect(() => {
    updateConfigStore('ps4Hosts', ps4Hosts);
    updateConfigStore('curSelectPs4HostId', curSelectPs4HostId);
  }, [curSelectPs4HostId, ps4Hosts]);

  const navigate = useNavigate();

  const handleInstall = async (file: FileStat) => {
    try {
      if (!curPs4Host) {
        return Notification.error({
          id: 'ps4-installer-no-host',
          title: `Send install task failed`,
          content: (
            <>
              <p>{file.basename}</p>
              Please
              <Link
                onClick={() => {
                  Notification.remove('ps4-installer-no-host');
                  navigate('/hosts?openPs4Host=true');
                }}
              >
                add ps4 host
              </Link>
              first
            </>
          ),
          duration: 0
        });
      }
      if (!fileServerHostId) {
        throw new Error(`File server host not found`);
      }
      if (!file.downloadUrl) {
        throw new Error(`Download url not found`);
      }
      Notification.info({
        id: file.basename,
        title: file.basename,
        content: `Start send install task to PS4`
      });
      const params: InstallParams<InstallType.DIRECT> = {
        type: InstallType.DIRECT,
        packages: [file.downloadUrl]
      };
      const { data } = await installApi(params);
      if (data.status === 'fail') {
        // @ts-ignore
        const errorCode = data?.error_code?.toString(16);
        const errorMessage = errorCode?.startsWith('809900')
          ? `Please check if it is installed`
          : `Install failed ${errorCode ? ': 0x' + errorCode : ''}`;
        throw new Error(errorMessage);
      }
      if (data.task_id && !installTasks.find(item => item.taskId === data.task_id)) {
        installTasks.unshift({
          file,
          taskId: data.task_id,
          title: data.title,
          ps4HostUrl: curPs4Host.url,
          fileServerHostId,
          status: TaskStatus.INSTALLING
        });
        setInstallTasks([...installTasks]);
        Notification.success({
          id: file.basename,
          title: data.title || file.basename,
          content: (
            <>
              Start install, you can
              <Link
                onClick={() => {
                  Notification.remove(file.basename);
                  navigate(`/tasks`);
                }}
              >
                view progress
              </Link>
            </>
          )
        });
      }
    } catch (err) {
      // @ts-ignore
      const errMessage = err?.response?.data?.error || err?.message;
      const isErrorCausedByFilePathFormat = errMessage.includes('Unable to set up prerequisites for package');
      Notification.error({
        id: file.basename,
        title: `${file.basename} Install failed`,
        duration: 0,
        content: errMessage ? (
          <>
            <span>{errMessage}</span>
            {isErrorCausedByFilePathFormat && (
              <p>
                This may be caused by the presence of Chinese characters or spaces in the file path. You can try this
                remote pkg installer on your PS4: <RPILink />
              </p>
            )}
          </>
        ) : null
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
          if (data._percent === 100) {
            if (window.electron) {
              new window.Notification(item.title, { body: 'Installed successfully' });
            } else {
              Notification.success({
                id: item.title,
                title: item.title,
                content: `Installed successfully`
              });
            }
          }
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
