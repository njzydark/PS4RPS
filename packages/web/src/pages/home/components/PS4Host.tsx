import { Button, Drawer, Select, Space, Typography } from '@arco-design/web-react';
import { IconPlus, IconUnorderedList } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { useContainer } from '../container';
import { InstallTaskList } from './InstallTaskList';
import { PS4HostFormModal } from './PS4HostFormModal';

export const PS4Host = () => {
  const [visible, setVisible] = useState(false);

  const { ps4Installer, taskListVisible, setTaskListVisible } = useContainer();
  const { ps4Hosts, curSelectPs4HostId, setCurSelectPs4HostId, setPs4Hosts } = ps4Installer;

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
        <Button icon={<IconPlus />} onClick={() => setVisible(true)} />
        <Button
          type="primary"
          icon={<IconUnorderedList />}
          onClick={() => {
            setTaskListVisible(true);
          }}
        />
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
      <PS4HostFormModal
        visible={visible}
        onOk={value => {
          setPs4Hosts(pre => {
            pre.push({
              id: value.id as string,
              url: value.url,
              alias: value.alias
            });
            return pre;
          });
          if (value.id) {
            setCurSelectPs4HostId(value.id);
          }
        }}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};
