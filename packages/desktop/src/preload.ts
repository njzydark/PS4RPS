import { ipcRendererInvoke, ipcRendererSendSync } from 'common/typedIpc';
import { IElectronAPI } from 'common/types';
import { contextBridge, shell } from 'electron';

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
    chnageWindowStatus: status => ipcRendererInvoke('chnageWindowStatus', status),
    openExternal: url => shell.openExternal(url),
    getPath: path => ipcRendererInvoke('getPath', path),
    getAppInfo: () => ipcRendererInvoke('getAppInfo'),
    openDirectoryDialog: () => ipcRendererSendSync('openDirectoryDialog'),
    createWebDavServer: ({ directoryPath, port }) => ipcRendererInvoke('createWebDavServer', { directoryPath, port })
  };

  contextBridge.exposeInMainWorld('electron', electronApi);
};

preload();
