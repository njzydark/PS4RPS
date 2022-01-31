import { Button, Table, TableColumnProps } from '@arco-design/web-react';

import { FileStat } from '@/types';

import { useContainer } from '../container';

const blackList = ['.DS_Store', '@eaDir'];

export const WebDavFileList = () => {
  const {
    webDAV: { data, loading },
    handleInstall
  } = useContainer();

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

  return (
    <Table
      border={false}
      size="small"
      pagination={false}
      data={data.filter(file => !blackList.includes(file.basename))}
      columns={columns}
      loading={loading}
      rowKey="filename"
    />
  );
};
