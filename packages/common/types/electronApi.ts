export interface IElectronIpcMainHandles {
  getAppVersion: () => Promise<string>;
  openDirectoryDialog: () => Promise<string | undefined>;
  createWebDavServer: (params: { directoryPath: string; port: number }) => Promise<{
    success: boolean;
    url?: string;
    errorMessage?: string;
  }>;
}

export interface IElectronAPI extends IElectronIpcMainHandles {
  platform: NodeJS.Platform;
}
