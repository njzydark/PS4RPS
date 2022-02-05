import './preload';

import { config as dotenvConfig } from 'dotenv';
import { app } from 'electron';
import reloader from 'electron-reloader';

import { Ipc } from './ipc';
import { Logger } from './logger';
import { WindowManager } from './windowManager';

try {
  module.filename = __filename;
  reloader(module, {
    watchRenderer: false
  });
} catch (err) {
  console.error(err);
}

Logger.getInstance().init();

dotenvConfig({ path: '../../.env' });

const gotTheLock = app.requestSingleInstanceLock();

const windowManager = WindowManager.getInstance();

if (gotTheLock) {
  app.on('ready', () => {
    console.log('app ready');
    Ipc.getInstance();
    windowManager.showWindow();
  });
  app.on('window-all-closed', function () {
    console.log('app all window closed');
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    console.log('app activate');
    windowManager.showWindow();
  });
  app.on('second-instance', () => {
    console.warn('app second instance emit');
    windowManager.handleSecondInstance();
  });
} else {
  app.quit();
}
