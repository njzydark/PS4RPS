import { createContainer } from '@/context/container';
import { FileStat } from '@/types';

import { usePS4 } from './hooks/usePS4Installer';
import { useWebDAV } from './hooks/useWebDAV';

const useHook = () => {
  const webDAV = useWebDAV();
  const { servers, curSelectServerId, webDavClient } = webDAV;

  const curServer = servers.find(server => server.id === curSelectServerId);
  const ps4Installer = usePS4(curServer?.url);

  const handleDownload = async (file: FileStat) => {
    if (webDavClient.current) {
      file.downloadUrl = webDavClient.current.getFileDownloadLink(file.filename);
      ps4Installer.handleInstall(file);
    }
  };

  return {
    handleDownload,
    ...webDAV,
    ...ps4Installer
  };
};

export const { useContainer, Provider } = createContainer(useHook);
