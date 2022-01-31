import { Link, Progress, Radio, Space, Table, TableColumnProps } from '@arco-design/web-react';
import { useState } from 'react';

import { InstallingData, TaskActionType, TaskStatus } from '@/types';

import { useContainer } from '../container';

export const InstallTaskList = () => {
  const {
    ps4Installer: { installingData, handleChangeInstallingItemStatus }
  } = useContainer();

  const [type, setType] = useState<'all' | TaskStatus>('all');

  const columns: TableColumnProps<InstallingData>[] = [
    {
      title: 'Title',
      dataIndex: 'title'
    },
    {
      title: 'Progress',
      render: (_, record) => {
        return (
          <Progress
            size="large"
            percent={record.progressInfo?._percent || 0}
            animation={record.status === TaskStatus.INSTALLING}
          />
        );
      }
    },
    {
      title: 'Action',
      align: 'left',
      width: 200,
      render: (_, record) => {
        return (
          <Space size={8}>
            {record.status === TaskStatus.INSTALLING && (
              <Link onClick={() => handleChangeInstallingItemStatus(record, TaskActionType.PAUSE)}>Pause</Link>
            )}
            {record.status === TaskStatus.PAUSED && (
              <Link onClick={() => handleChangeInstallingItemStatus(record, TaskActionType.RESUME)}>Resume</Link>
            )}
            {record.status !== TaskStatus.FINISHED && (
              <Link onClick={() => handleChangeInstallingItemStatus(record, TaskActionType.CANCEL)}>Cancel</Link>
            )}
            {<Link onClick={() => handleChangeInstallingItemStatus(record, TaskActionType.CANCEL)}>Delete</Link>}
          </Space>
        );
      }
    }
  ];

  const data = installingData.filter(item => {
    if (type === 'all') {
      return item;
    } else {
      return item.status === type;
    }
  });

  return (
    <div>
      <Radio.Group type="button" value={type} style={{ marginBottom: 12 }} onChange={setType}>
        <Radio value="all">All</Radio>
        {Object.values(TaskStatus).map(status => (
          <Radio key={status} value={status}>
            {status}
          </Radio>
        ))}
      </Radio.Group>
      <Table border={false} size="small" pagination={false} data={data} columns={columns} rowKey="taskId" />
    </div>
  );
};
