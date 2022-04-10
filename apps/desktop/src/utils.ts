import { networkInterfaces } from 'os';

export const getIp = () => {
  return Object.values(networkInterfaces())
    .flat()
    .find(i => i?.family == 'IPv4' && !i?.internal)?.address;
};
