import { ipcRendererInvoke, ipcRendererSendSync } from 'common/typedIpc';
import { IElectronAPI } from 'common/types';
import { contextBridge } from 'electron';

export const preload = () => {
  if (!global.window) {
    return;
  }

  const electronApi: IElectronAPI = {
    platform: process.platform,
    getAppVersion: () => ipcRendererInvoke('getAppVersion'),
    openDirectoryDialog: () => ipcRendererSendSync('openDirectoryDialog'),
    createWebDavServer: ({ directoryPath, port }) => ipcRendererInvoke('createWebDavServer', { directoryPath, port })
  };

  contextBridge.exposeInMainWorld('electron', electronApi);
};

preload();
