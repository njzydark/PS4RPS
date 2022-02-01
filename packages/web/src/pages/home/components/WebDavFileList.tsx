import { Button, Table, TableColumnProps } from '@arco-design/web-react';

import { FileStat } from '@/types';

import { useContainer } from '../container';

const blackList = ['.DS_Store', '@eaDir', '._.DS_Store'];

export const WebDavFileList = () => {
  const {
    webDAV: { webDavHostFiles, loading },
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
      data={webDavHostFiles.filter(file => !blackList.includes(file.basename))}
      columns={columns}
      loading={loading}
      rowKey="filename"
    />
  );
};
