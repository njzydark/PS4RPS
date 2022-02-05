import { ConfigStore } from 'common/types/configStore';

export const formatFileSize = (size: number) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (size < MB) {
    return `${(size / KB).toFixed(1)} KB`;
  } else if (size < GB) {
    return `${(size / MB).toFixed(1)} MB`;
  } else {
    return `${(size / GB).toFixed(1)} GB`;
  }
};

export const getInitConfigFromStore = <T extends keyof ConfigStore>(key: T, defaultValue: ConfigStore[T]) => {
  try {
    if (window.electron) {
      return window.electron.configStore.get(key) || defaultValue;
    } else {
      return JSON.parse(localStorage.getItem(key) as string) || defaultValue;
    }
  } catch (err) {
    return defaultValue;
  }
};

export const updateConfigStore = <T extends keyof ConfigStore>(key: T, value: ConfigStore[T]) => {
  try {
    if (window.electron) {
      return window.electron.configStore.set(key, value);
    } else {
      return localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.log(`update config error: ${(err as Error).message}`);
  }
};
