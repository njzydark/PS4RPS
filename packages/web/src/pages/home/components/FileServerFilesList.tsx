import { Table, TableColumnProps } from '@arco-design/web-react';
import { IconFile, IconFolder } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

import { Link } from '@/components/Link';
import { FileStat } from '@/types';
import { formatFileSize } from '@/utils';

import { useContainer } from '../container';

export const FileServerFilesList = () => {
  const {
    fileServer: { fileServerFiles, loading, setPaths, searchKeyWord },
    handleInstall
  } = useContainer();

  const columns: TableColumnProps<FileStat>[] = [
    {
      title: 'FileName',
      dataIndex: 'basename',
      ellipsis: true,
      render: (val, record) => (
        <Link
          hoverable={false}
          onClick={() => {
            if (record.type === 'directory') {
              setPaths(record.filename.replace(/\\/g, '/').split('/'));
            } else {
              handleInstall(record);
            }
          }}
        >
          {record.type === 'directory' ? (
            <IconFolder style={{ marginRight: 6 }} />
          ) : (
            <IconFile style={{ marginRight: 6 }} />
          )}
          {val}
        </Link>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      align: 'right',
      render: val => (val ? formatFileSize(val) : '-')
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastmod',
      align: 'right',
      render: val => (val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-')
    }
  ];

  return (
    <Table
      border={false}
      size="small"
      pagination={false}
      data={fileServerFiles.filter(item => item.basename.toLowerCase().includes(searchKeyWord.toLowerCase()))}
      columns={columns}
      loading={loading}
      rowKey="filename"
    />
  );
};
