import { ElectronConfigStore } from './configStore';

export interface IElectronIpcMainHandles {
  configStore: {
    get: ElectronConfigStore['get'];
    set: ElectronConfigStore['set'];
    has: ElectronConfigStore['has'];
    delete: ElectronConfigStore['delete'];
    clear: ElectronConfigStore['clear'];
  };
  getAppVersion: () => Promise<string>;
  openDirectoryDialog: () => Promise<string | undefined>;
  createWebDavServer: (params: { directoryPath: string; port: number }) => Promise<
    | {
        url?: string;
        errorMessage?: string;
      }
    | undefined
  >;
}

export interface IElectronAPI extends IElectronIpcMainHandles {
  platform: NodeJS.Platform;
}
