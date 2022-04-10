import { PkgListUIType } from 'common/types/configStore';
import { lazy, Suspense } from 'react';

import { useContainer } from '@/store/container';
import { FileStat } from '@/types';

import { FileServerHostEmpty } from './components/FileServerHostEmpty';
import { Filter } from './components/Filter';
import { TableList, TableListProps } from './components/TableList';

const CardList = lazy(() => import('./components/CardList'));

export const Home = () => {
  const {
    fileServer: { fileServerFiles, loading, setPaths, searchKeyWord, fileServerHosts },
    handleInstall,
    settings
  } = useContainer();

  const handleNameClick = (record: FileStat) => {
    if (record.type === 'directory') {
      setPaths(record.filename.replace(/\\/g, '/').split('/'));
    } else {
      handleInstall(record);
    }
  };

  const formatPkgName = (record: FileStat) => {
    if (settings.displayPkgRawTitle) {
      return record.paramSfo?.TITLE || record.basename;
    }
    return record.basename.replace(/\.pkg$/i, '');
  };

  const data = fileServerFiles.filter(
    item =>
      item.basename.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
      item.paramSfo?.TITLE.toLowerCase().includes(searchKeyWord.toLowerCase())
  );

  const props: TableListProps = {
    data,
    handleNameClick,
    formatPkgName,
    loading
  };

  if (!fileServerHosts?.length) {
    return <FileServerHostEmpty />;
  }

  return (
    <>
      <Filter />
      {settings?.pkgListUIType === PkgListUIType.table ? (
        <TableList {...props} />
      ) : (
        <Suspense fallback={<div>loading...</div>}>
          <CardList {...props} />
        </Suspense>
      )}
    </>
  );
};

export default Home;
