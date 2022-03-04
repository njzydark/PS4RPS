import { createContainer } from '@/context/container';
import { FileServerType, FileStat } from '@/types';

import { useFileServer } from './hooks/useFileServer';
import { usePS4Installer } from './hooks/usePS4Installer';

const useHook = () => {
  const fileServer = useFileServer();
  const { fileServerHosts, curFileServerHostId, webDavClient } = fileServer;

  const curFileServerHost = fileServerHosts.find(host => host.id === curFileServerHostId);
  const ps4Installer = usePS4Installer(curFileServerHost?.id);

  const handleInstall = async (file: FileStat) => {
    if (curFileServerHost?.type === FileServerType.WebDAV && webDavClient.current) {
      file.downloadUrl = webDavClient.current.getFileDownloadLink(file.filename);
    } else if (curFileServerHost?.type === FileServerType.StaticFileServer) {
      file.downloadUrl = curFileServerHost.url + file.filename.replace(/\\/g, '/');
    }
    ps4Installer.handleInstall(file);
  };

  return {
    fileServer,
    ps4Installer,
    handleInstall
  };
};

export const { useContainer, Provider } = createContainer(useHook);
