import { Button, Table, TableColumnProps } from '@arco-design/web-react';

import { FileStat } from '@/types';

import { useContainer } from '../container';
import styles from './GameList.module.less';

const blackList = ['.DS_Store', '@eaDir'];

export const GameList = () => {
  const { loading, data, handleDownload } = useContainer();

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
          <Button onClick={() => handleDownload(file)} type="text">
            Install
          </Button>
        );
      }
    }
  ];

  return (
    <div className={styles['game-list-wrapper']}>
      <Table
        border={false}
        size="small"
        pagination={false}
        data={data.filter(file => !blackList.includes(file.basename))}
        columns={columns}
        loading={loading}
        rowKey="filename"
      />
    </div>
  );
};
