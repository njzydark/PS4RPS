import { Button, Select, Space, Typography } from '@arco-design/web-react';
import { IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { useContainer } from '../container';
import { WebDavFormModal } from './WebDavFormModal';

export const WebDavHost = () => {
  const [visible, setVisible] = useState(false);

  const { webDAV } = useContainer();
  const { servers, curSelectServerId, setServers, setCurSelectServerId, getData } = webDAV;

  return (
    <div>
      <Typography.Title heading={6}>WebDAV Host</Typography.Title>
      <Space>
        <Select style={{ width: 220 }} value={curSelectServerId} onChange={setCurSelectServerId}>
          {servers.map(server => (
            <Select.Option key={server.id} value={server.id}>
              {server.alias || server.url}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<IconPlus />} onClick={() => setVisible(true)}>
          Add
        </Button>
        <Button icon={<IconRefresh />} type="primary" onClick={getData}>
          Refresh
        </Button>
      </Space>
      <WebDavFormModal
        visible={visible}
        onOk={value => {
          setServers(pre => {
            pre.push({
              id: String(new Date().getTime()),
              url: value.url,
              alias: value.alias,
              options: {
                username: value.username,
                password: value.password
              }
            });
            return pre;
          });
        }}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};
