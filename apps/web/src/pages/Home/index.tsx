import { Spin } from '@arco-design/web-react';
import { PkgListClickAction, PkgListUIType } from 'common/types/configStore';
import { lazy, Suspense, useState } from 'react';

import { useContainer } from '@/store/container';
import { FileStat } from '@/types';

import { DetailDrawer } from './components/DetailDrawer';
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

  const [detailDrawserData, setDetailDrawerData] = useState<{
    visible: boolean;
    data?: FileStat;
  }>({
    visible: false
  });

  const handleInstallByActionType = (record: FileStat, clickAction: PkgListClickAction) => {
    if (record.type === 'directory') {
      setPaths(record.filename.replace(/\\/g, '/').split('/'));
    } else {
      if (
        (clickAction === PkgListClickAction.auto && settings.pkgListClickAction === PkgListClickAction.install) ||
        clickAction === PkgListClickAction.install
      ) {
        handleInstall(record);
      } else {
        setDetailDrawerData({
          visible: true,
          data: record
        });
      }
    }
  };

  const data = fileServerFiles.filter(
    item =>
      item.basename.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
      item.paramSfo?.TITLE.toLowerCase().includes(searchKeyWord.toLowerCase())
  );

  const props: TableListProps = {
    data,
    handleInstallByActionType,
    loading,
    displayPkgRawTitle: settings.displayPkgRawTitle
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
        <Suspense fallback={<Spin />}>
          <CardList {...props} />
        </Suspense>
      )}
      <DetailDrawer
        {...detailDrawserData}
        handleCancel={() => {
          setDetailDrawerData({
            visible: false,
            data: undefined
          });
        }}
        displayPkgRawTitle={settings.displayPkgRawTitle}
        handleInstallByActionType={handleInstallByActionType}
      />
    </>
  );
};

export default Home;
