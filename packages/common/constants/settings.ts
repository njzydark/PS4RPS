import { PkgListUIType, Settings } from '../types/configStore';

export const defaultSettings: Settings = {
  pkgListUIType: PkgListUIType.card,
  displayPkgRawTitle: false,
  displayLogo: true,
  forceWebDavDownloadLinkToHttp: true
};
