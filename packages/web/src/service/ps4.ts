import axios from 'axios';
import JSON5 from 'json5';

import { ProgressInfo } from '@/types';

const instance = axios.create({
  timeout: 5000,
  transformResponse: [
    function transformResponse(data, headers) {
      if (headers?.['content-type'] === 'application/json') {
        return JSON5.parse(data);
      }
    }
  ]
});

instance.interceptors.request.use(value => {
  if (!value.baseURL) {
    throw new Error('The PS4 Url is empty');
  }
  return value;
});

export const changeBaseUrl = (url: string) => {
  if (!url.includes('/api')) {
    url += '/api';
  }
  instance.defaults.baseURL = url;
};

export enum InstallType {
  DIRECT = 'direct',
  URL = 'ref_pkg_url'
}

export enum PkgType {
  GAME = 6,
  AC = 7,
  PATCH = 8,
  LICENSE = 9
}

type DirectInstallParams = {
  type: InstallType.DIRECT;
  packages: string[];
};

type UrlInstallParams = {
  type: InstallType.URL;
  url: string;
};

export type InstallParams<T> = T extends InstallType.DIRECT ? DirectInstallParams : UrlInstallParams;

export const checkAppExist = (title_id: string) => {
  return instance.post('/is_exists', {
    title_id
  });
};

export type InstallParseResponse = {
  status: 'success' | 'fail';
  task_id: number;
  title: string;
  error_code?: string;
};

export const installApi = <T = InstallType>(data: InstallParams<T>) => {
  // return new Promise<{ data: InstallParseResponse }>(resolve => {
  //   setTimeout(() => {
  //     resolve({
  //       data: {
  //         status: 'success',
  //         task_id: Math.random() * 100,
  //         title: 'test'
  //       }
  //     });
  //   }, 800);
  // });
  return instance.post<InstallParseResponse>('/install', data);
};

export const unstallGameApi = (title_id: string) => {
  return instance.post('/uninstall_game', { title_id });
};

export const unstallPatchApi = (title_id: string) => {
  return instance.post('/uninstall_patch', { title_id });
};

export const unstallACApi = (content_id: string) => {
  return instance.post('/uninstall_ac', { content_id });
};

export const unstallThemeApi = (content_id: string) => {
  return instance.post('/uninstall_theme', { content_id });
};

export const getTaskIdApi = (content_id: string, sub_type: PkgType) => {
  return instance.post('/find_task', {
    content_id,
    sub_type
  });
};

type StatusResponse = {
  status: 'success' | 'fail';
  error_code?: number;
};

export type TaskProgressResponse = ProgressInfo & StatusResponse;

export const getTaskProgressApi = (task_id: number) => {
  return instance.post<TaskProgressResponse>('/get_task_progress', { task_id });
};

export const startApi = (task_id: number) => {
  return instance.post<StatusResponse>('/start_task', { task_id });
};

export const stopApi = (task_id: number) => {
  return instance.post<StatusResponse>('/stop_task', { task_id });
};

export const pauseApi = (task_id: number) => {
  return instance.post<StatusResponse>('/pause_task', { task_id });
};

export const resumeApi = (task_id: number) => {
  return instance.post<StatusResponse>('/resume_task', { task_id });
};

export const cancelApi = (task_id: number) => {
  return instance.post<StatusResponse>('/unregister_task', { task_id });
};
