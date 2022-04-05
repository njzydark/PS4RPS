import { Divider } from '@/components/Divider';

import { FileServerHost } from './components/FileServerHost';
import { PS4Host } from './components/PS4Host';

export const Hosts = () => {
  return (
    <>
      <PS4Host />
      <Divider />
      <FileServerHost />
    </>
  );
};
