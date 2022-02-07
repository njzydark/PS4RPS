import { Link, Progress, Radio, Space, Table, TableColumnProps } from '@arco-design/web-react';
import { useState } from 'react';

import { InstallTask, TaskActionType, TaskStatus } from '@/types';

import { useContainer } from '../container';

export const InstallTaskList = () => {
  const {
    ps4Installer: { installTasks, handleChangeInstallTaskStatus }
  } = useContainer();

  const [type, setType] = useState<'all' | TaskStatus>('all');

  const columns: TableColumnProps<InstallTask>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      ellipsis: true,
      width: 150
    },
    {
      title: 'Progress',
      render: (_, record) => {
        return (
          <Progress percent={record.progressInfo?._percent || 0} animation={record.status === TaskStatus.INSTALLING} />
        );
      }
    },
    {
      title: 'Action',
      align: 'left',
      width: 220,
      render: (_, record) => {
        return (
          <Space size={8}>
            {record.status === TaskStatus.INSTALLING && (
              <Link onClick={() => handleChangeInstallTaskStatus(record, TaskActionType.PAUSE)}>Pause</Link>
            )}
            {record.status === TaskStatus.PAUSED && (
              <Link onClick={() => handleChangeInstallTaskStatus(record, TaskActionType.RESUME)}>Resume</Link>
            )}
            {record.status !== TaskStatus.FINISHED && (
              <Link onClick={() => handleChangeInstallTaskStatus(record, TaskActionType.CANCEL)}>Cancel</Link>
            )}
            {<Link onClick={() => handleChangeInstallTaskStatus(record, TaskActionType.DELETE)}>Delete</Link>}
          </Space>
        );
      }
    }
  ];

  const data = installTasks.filter(item => {
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
