import { ElectronConfigStore } from './configStore';

export interface IElectronIpcMainHandles {
  configStore: {
    get: ElectronConfigStore['get'];
    set: ElectronConfigStore['set'];
    has: ElectronConfigStore['has'];
    delete: ElectronConfigStore['delete'];
    clear: ElectronConfigStore['clear'];
  };
  getPath: (path: Parameters<Electron.App['getPath']>[0]) => Promise<string>;
  chnageWindowStatus: (status: 'minimize' | 'maximize' | 'close') => void;
  getAppInfo: () => Promise<{
    version: string;
    name: string;
    path: string;
  }>;
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
  openExternal: (url: string) => void;
}
