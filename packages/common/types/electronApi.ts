export interface IElectronIpcMainHandles {
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
