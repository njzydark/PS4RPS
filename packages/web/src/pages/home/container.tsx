import { useState } from 'react';

import { createContainer } from '@/context/container';
import { FileStat } from '@/types';

import { usePS4Installer } from './hooks/usePS4Installer';
import { useWebDAV } from './hooks/useWebDAV';

const useHook = () => {
  const [taskListVisible, setTaskListVisible] = useState(false);

  const webDAV = useWebDAV();
  const { webDavHosts, curSelectWebDavHostId, webDavClient } = webDAV;

  const curWebDavHost = webDavHosts.find(host => host.id === curSelectWebDavHostId);
  const ps4Installer = usePS4Installer(curWebDavHost?.url);

  const handleInstall = async (file: FileStat) => {
    if (webDavClient.current) {
      file.downloadUrl = webDavClient.current.getFileDownloadLink(file.filename);
      ps4Installer.handleInstall(file);
    }
  };

  return {
    taskListVisible,
    setTaskListVisible,
    webDAV,
    ps4Installer,
    handleInstall
  };
};

export const { useContainer, Provider } = createContainer(useHook);
