import { FileStat as RawFileStat, WebDAVClientOptions } from 'webdav/web';

export type FileStat = RawFileStat & {
  downloadUrl?: string;
};

export type ServerInfo = {
  id: string;
  alias?: string;
  url: string;
  options?: WebDAVClientOptions;
};

export type InstallingData = {
  file: FileStat;
  taskId: number;
  ps4BaseUrl: string;
  installBaseUrl: string;
};
