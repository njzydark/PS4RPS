import { ipcMainHandle, ipcMainOn } from 'common/typedIpc';
import { app, BrowserWindow, dialog } from 'electron';

import { Logger } from './logger';
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
    ipcMainHandle('getAppVersion', async () => {
      return app.getVersion();
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
  }
}
