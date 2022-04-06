/* eslint-disable @typescript-eslint/no-use-before-define */
import { Table, TableColumnProps } from '@arco-design/web-react';
import { IconFile, IconFolder } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

import { Link } from '@/components/Link';
import { FileStat } from '@/types';
import { formatFileSize } from '@/utils';

export type TableListProps = {
  handleNameClick: (record: FileStat) => void;
  formatPkgName: (record: FileStat) => string;
  loading?: boolean;
  data: FileStat[];
};

export const TableList = ({ handleNameClick, formatPkgName, loading, data }: TableListProps) => {
  const columns: TableColumnProps<FileStat>[] = [
    {
      title: 'FileName',
      dataIndex: 'basename',
      ellipsis: true,
      render: (val, record) => (
        <Link hoverable={false} onClick={() => handleNameClick(record)}>
          {record.type === 'directory' ? (
            <IconFolder style={{ marginRight: 6 }} />
          ) : (
            <IconFile style={{ marginRight: 6 }} />
          )}
          {formatPkgName(record)}
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
      data={data}
      columns={columns}
      loading={loading}
      rowKey="filename"
    />
  );
};
