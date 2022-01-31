import { Button, Select, Space, Typography } from '@arco-design/web-react';
import { IconPlus, IconSync } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { useContainer } from '../container';
import { WebDavFormModal } from './WebDavFormModal';

export const WebDavHost = () => {
  const [visible, setVisible] = useState(false);

  const { webDAV } = useContainer();
  const { webDavHosts, curSelectWebDavHostId, setWebDavHosts, setCurSelectWebDavHostId, getWebDavHostFiles } = webDAV;

  return (
    <div>
      <Typography.Title heading={6}>WebDAV Host</Typography.Title>
      <Space>
        <Select style={{ width: 220 }} value={curSelectWebDavHostId} onChange={setCurSelectWebDavHostId}>
          {webDavHosts.map(host => (
            <Select.Option key={host.id} value={host.id}>
              {host.alias || host.url}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<IconPlus />} onClick={() => setVisible(true)}>
          Add
        </Button>
        <Button icon={<IconSync />} type="primary" onClick={getWebDavHostFiles}>
          Refresh
        </Button>
      </Space>
      <WebDavFormModal
        visible={visible}
        onOk={value => {
          setWebDavHosts(pre => {
            pre.push({
              id: value.id as string,
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
