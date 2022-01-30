import { Button, Radio, Table, TableColumnProps } from '@arco-design/web-react';
import { useState } from 'react';

import { FileStat, InstallingData } from '@/types';

import { useContainer } from '../container';
import styles from './GameList.module.less';

const blackList = ['.DS_Store', '@eaDir'];

export const GameList = () => {
  const {
    webDAV: { data, loading },
    ps4Installer: { installingData },
    handleInstall
  } = useContainer();

  const [type, setType] = useState<'webdav' | 'installing'>('webdav');

  const columns: TableColumnProps<FileStat>[] = [
    {
      title: 'FileName',
      dataIndex: 'basename'
    },
    {
      title: 'Size',
      dataIndex: 'size'
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastmod'
    },
    {
      title: 'Action',
      align: 'center',
      render: (_, file) => {
        return (
          <Button onClick={() => handleInstall(file)} type="text">
            Install
          </Button>
        );
      }
    }
  ];

  const installingColumns: TableColumnProps<InstallingData>[] = [
    {
      title: 'TaskID',
      dataIndex: 'taskId'
    },
    {
      title: 'FileName',
      dataIndex: 'file.basename'
    },
    {
      title: 'Size',
      dataIndex: 'file.size'
    }
  ];

  return (
    <div className={styles['game-list-wrapper']}>
      <Radio.Group type="button" value={type} style={{ marginBottom: 12 }} onChange={setType}>
        <Radio value="webdav">WebDAV</Radio>
        <Radio value="installing">Installing</Radio>
      </Radio.Group>
      {type === 'installing' ? (
        <Table
          border={false}
          size="small"
          pagination={false}
          data={installingData}
          columns={installingColumns}
          loading={loading}
          rowKey="filename"
        />
      ) : (
        <Table
          border={false}
          size="small"
          pagination={false}
          data={data.filter(file => !blackList.includes(file.basename))}
          columns={columns}
          loading={loading}
          rowKey="filename"
        />
      )}
    </div>
  );
};
