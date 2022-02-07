import { ipcMainHandle, ipcMainOn } from 'common/typedIpc';
import { app, BrowserWindow, dialog } from 'electron';
import fs from 'fs';

import { Logger } from './logger';
import { storeManager } from './store';
import { getIp } from './utils';
import { webDavServerManager } from './webDavServer';

export class Ipc {
  static win: BrowserWindow;

  private static instance: Ipc;

  static getInstance() {
    if (!Ipc.instance) {
      Ipc.instance = new Ipc();
    }
    return Ipc.instance;
  }

  static sendMessage(channel: string, channelData?: any) {
    if (BrowserWindow.getAllWindows().length > 0) {
      Ipc.win.webContents.send(channel, channelData);
    }
  }

  logger: Logger;

  protected constructor() {
    this.logger = Logger.getInstance();

    this.init();
  }

  protected init() {
    this.initWebDavServer();

    ipcMainHandle('getAppInfo', async () => {
      const version = app.getVersion();
      const path = app.getAppPath();
      const name = app.getName();
      return {
        version,
        path,
        name
      };
    });

    ipcMainOn('openDirectoryDialog', async event => {
      const { filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      // eslint-disable-next-line prefer-destructuring
      event.returnValue = filePaths[0];
    });

    ipcMainHandle('createWebDavServer', async (_, { directoryPath, port }) => {
      try {
        const res = await webDavServerManager.create({ directoryPath, port });
        const ip = getIp();
        if (res && ip) {
          return {
            url: `http://${getIp()}:${port}`
          };
        }
      } catch (err) {
        return {
          errorMessage: `Create WebDAV server failed: ${(err as Error).message}`
        };
      }
    });

    ipcMainHandle('getPath', async (_, path) => {
      return app.getPath(path);
    });

    ipcMainHandle('chnageWindowStatus', async (_, status) => {
      if (status === 'minimize') {
        Ipc.win.minimize();
      }
      if (status === 'maximize') {
        if (Ipc.win.isMaximized()) {
          Ipc.win.unmaximize();
        } else {
          Ipc.win.maximize();
        }
      }
      if (status === 'close') {
        Ipc.win.close();
      }
    });
  }

  protected async initWebDavServer() {
    try {
      const { webDavHosts, curSelectWebDavHostId } = storeManager.configStore.store;
      const curWebDavServer = webDavHosts.find(item => item.id === curSelectWebDavHostId);
      if (curWebDavServer?.port && curWebDavServer?.directoryPath && fs.existsSync(curWebDavServer?.directoryPath)) {
        await webDavServerManager.create({ directoryPath: curWebDavServer.directoryPath, port: curWebDavServer.port });
        console.log(`Init WebDAV server success: ${curWebDavServer.directoryPath}`);
      }
    } catch (err) {
      console.error(`Init WebDAV server failed: ${(err as Error).message}`);
    }
  }
}
