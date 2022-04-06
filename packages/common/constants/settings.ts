import { PkgListUIType, Settings } from '../types/configStore';

export const defaultSettings: Settings = {
  pkgListUIType: PkgListUIType.table,
  displayPkgRawTitle: false,
  displayLogo: true,
  forceWebDavDownloadLinkToHttp: true
};
