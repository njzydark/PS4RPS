import { Ps4PkgParamSfo } from '@njzy/ps4-pkg-info/web';
import { FileStat as RawFileStat, WebDAVClientOptions } from 'webdav/web';

export type FileStat = RawFileStat & {
  downloadUrl?: string;
  icon0?: string;
  paramSfo?: Ps4PkgParamSfo;
};

export enum FileServerType {
  StaticFileServer = 'StaticFileServer',
  WebDAV = 'WebDAV'
}

export type WebDAVHost = {
  id: string;
  type: FileServerType.WebDAV;
  alias?: string;
  url: string;
  options?: WebDAVClientOptions;
};

export type StaticFileServerHost = {
  id: string;
  type: FileServerType.StaticFileServer;
  alias?: string;
  directoryPath: string;
  port: number;
  url: string;
};

export type FileServerHost = WebDAVHost | StaticFileServerHost;

export type PS4Host = {
  id: string;
  alias?: string;
  url: string;
};

export type ProgressInfo = {
  preparing_percent: number;
  local_copy_percent: number;
  rest_sec: number;
  rest_sec_total: number;
  num_index: number;
  num_total: number;
  length: number;
  length_total: number;
  transferred: number;
  transferred_total: number;
  error: number;
  bits: number;
  _percent: number;
};

export enum TaskStatus {
  PAUSED = 'Paused',
  INSTALLING = 'Installing',
  FINISHED = 'Finished'
}

export enum TaskActionType {
  PAUSE = 'Pause',
  RESUME = 'Resume',
  CANCEL = 'Cancel',
  DELETE = 'Delete'
}

export type InstallTask = {
  file: FileStat;
  taskId: number;
  title: string;
  ps4HostUrl: string;
  fileServerHostId: string;
  status: TaskStatus;
  progressInfo?: ProgressInfo;
  errorMessage?: string;
};
