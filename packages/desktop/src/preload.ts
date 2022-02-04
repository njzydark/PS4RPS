import { ipcRendererInvoke, ipcRendererSendSync } from 'common/typedIpc';
import { IElectronAPI } from 'common/types';
import { contextBridge } from 'electron';

import { configStore } from './store';

export const preload = () => {
  if (!global.window) {
    return;
  }

  const electronApi: IElectronAPI = {
    configStore: {
      // @ts-ignore
      get: (...args) => configStore.get(...args),
      // @ts-ignore
      set: (...args) => configStore.set(...args),
      has: key => configStore.has(key),
      delete: key => configStore.delete(key),
      clear: () => configStore.clear()
    },
    platform: process.platform,
    getAppVersion: () => ipcRendererInvoke('getAppVersion'),
    openDirectoryDialog: () => ipcRendererSendSync('openDirectoryDialog'),
    createWebDavServer: ({ directoryPath, port }) => ipcRendererInvoke('createWebDavServer', { directoryPath, port })
  };

  contextBridge.exposeInMainWorld('electron', electronApi);
};

preload();
