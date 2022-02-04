import { ConfigStore } from 'common/types/configStore';
import { app } from 'electron';
import ElectronStore from 'electron-store';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const devConfigDir = path.resolve(__dirname, '../../appDevConfig');

const cwd = isDev ? devConfigDir : app.getPath('userData');

export const configStore = new ElectronStore<ConfigStore>({
  name: 'config',
  cwd,
  defaults: {
    ps4Hosts: [],
    webDavHosts: []
  }
});
