import ElectronStore from 'electron-store';

export type WebDAVHost = {
  id: string;
  alias?: string;
  directoryPath?: string;
  port?: number;
  url: string;
  options?: any;
};

export type PS4Host = {
  id: string;
  alias?: string;
  url: string;
};

export enum PkgListUIType {
  table = 'table',
  card = 'card'
}

export enum PkgListClickAction {
  auto = 'auto',
  install = 'install',
  detail = 'detail'
}

export type Settings = {
  pkgListUIType: PkgListUIType;
  pkgListClickAction: PkgListClickAction;
  aggregationMode: boolean;
  displayPkgRawTitle: boolean;
  displayLogo: boolean;
  forceWebDavDownloadLinkToHttp: boolean;
  useBetaVersion?: boolean;
};

export type ConfigStore = {
  settings: Settings;
  webDavHosts: WebDAVHost[];
  fileServerHosts: WebDAVHost[];
  curSelectWebDavHostId?: string;
  curFileServerHostId?: string;
  ps4Hosts: PS4Host[];
  curSelectPs4HostId?: string;
};

export type ElectronConfigStore = ElectronStore<ConfigStore>;
