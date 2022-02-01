import { ipcMainHandle } from 'common/typedIpc';
import { app, BrowserWindow } from 'electron';

import { Logger } from './logger';

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
  }
}
