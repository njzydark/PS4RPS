import { IElectronAPI } from 'common/types';

declare global {
  interface Window {
    electron?: IElectronAPI;
  }
}

declare namespace Global {
  declare module '*.less' {
    const classes: { [className: string]: string };
    export default classes;
  }
}
