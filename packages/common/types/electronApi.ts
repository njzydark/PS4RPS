export interface IElectronIpcMainHandles {
  getAppVersion: () => Promise<string>;
}

export interface IElectronAPI extends IElectronIpcMainHandles {
  platform: NodeJS.Platform;
}
