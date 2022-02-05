import { ipcRendererInvoke, ipcRendererSendSync } from 'common/typedIpc';
import { IElectronAPI } from 'common/types';
import { contextBridge } from 'electron';

import { storeManager } from './store';

export const preload = () => {
  if (!global.window) {
    return;
  }

  const electronApi: IElectronAPI = {
    configStore: {
      get: (...args: [any]) => storeManager.configStore.get(...args),
      set: (...args: [any]) => storeManager.configStore.set(...args),
      has: key => storeManager.configStore.has(key),
      delete: key => storeManager.configStore.delete(key),
      clear: () => storeManager.configStore.clear()
    },
    platform: process.platform,
    getPath: path => ipcRendererInvoke('getPath', path),
    getAppVersion: () => ipcRendererInvoke('getAppVersion'),
    openDirectoryDialog: () => ipcRendererSendSync('openDirectoryDialog'),
    createWebDavServer: ({ directoryPath, port }) => ipcRendererInvoke('createWebDavServer', { directoryPath, port })
  };

  contextBridge.exposeInMainWorld('electron', electronApi);
};

preload();
