import { Button, Drawer, Select, Space, Typography } from '@arco-design/web-react';
import { IconUnorderedList } from '@arco-design/web-react/icon';

import { useContainer } from '../container';
import { InstallTaskList } from './InstallTaskList';

export const PS4Host = () => {
  const { ps4Installer, taskListVisible, setTaskListVisible } = useContainer();
  const { ps4Hosts, curSelectPs4HostId, setCurSelectPs4HostId } = ps4Installer;

  return (
    <div>
      <Typography.Title heading={6}>PS4 Host</Typography.Title>
      <Space>
        <Select
          allowCreate
          style={{ width: 220 }}
          value={curSelectPs4HostId}
          onChange={value => {
            setCurSelectPs4HostId(value);
          }}
        >
          {ps4Hosts.map(host => (
            <Select.Option key={host.id} value={host.id}>
              {host.alias || host.url}
            </Select.Option>
          ))}
        </Select>
        <Button
          icon={<IconUnorderedList />}
          onClick={() => {
            setTaskListVisible(true);
          }}
        >
          Install Task List
        </Button>
      </Space>
      <Drawer
        width={600}
        title={<span>PS4 Install Task List</span>}
        visible={taskListVisible}
        footer={null}
        onCancel={() => {
          setTaskListVisible(false);
        }}
      >
        <InstallTaskList />
      </Drawer>
    </div>
  );
};
