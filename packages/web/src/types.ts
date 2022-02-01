import { FileStat as RawFileStat, WebDAVClientOptions } from 'webdav/web';

export type FileStat = RawFileStat & {
  downloadUrl?: string;
};

export type WebDAVHost = {
  id: string;
  alias?: string;
  directoryPath?: string;
  port?: number;
  url: string;
  options?: WebDAVClientOptions;
};

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
  webDavHostUrl: string;
  status: TaskStatus;
  progressInfo?: ProgressInfo;
  errorMessage?: string;
};
