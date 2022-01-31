import { Button, Drawer, Select, Space, Typography } from '@arco-design/web-react';
import { IconUnorderedList } from '@arco-design/web-react/icon';

import { useContainer } from '../container';
import { InstallTaskList } from './InstallTaskList';

export const PS4Host = () => {
  const { ps4Installer, taskListVisible, setTaskListVisible } = useContainer();
  const { ps4BaseUrls, curSelectPS4BaseUrl, setCurSelectPS4BaseUrl, setPs4BaseUrls } = ps4Installer;

  return (
    <div>
      <Typography.Title heading={6}>PS4 Host</Typography.Title>
      <Space>
        <Select
          allowCreate
          style={{ width: 220 }}
          value={curSelectPS4BaseUrl}
          onChange={value => {
            if (!ps4BaseUrls.includes(value)) {
              setPs4BaseUrls(pre => [...pre, value]);
            }
            setCurSelectPS4BaseUrl(value);
          }}
        >
          {ps4BaseUrls.map(url => (
            <Select.Option key={url} value={url}>
              {url}
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
