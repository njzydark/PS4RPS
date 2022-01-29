import { Button, Select, Space } from '@arco-design/web-react';
import { IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import { Dispatch, SetStateAction, useState } from 'react';

import { ServerInfo } from '@/pages/home';

import { WebDavFormModal } from './WebDavFormModal';
import styles from './WebDavHost.module.less';

type Props = {
  servers: ServerInfo[];
  curSelectServerId: string;
  changeServers: Dispatch<SetStateAction<ServerInfo[]>>;
  changeCurSelectServerId: Dispatch<SetStateAction<string>>;
  handleRefresh: () => void;
};

export const WebDavHost = ({
  servers,
  curSelectServerId,
  changeServers,
  changeCurSelectServerId,
  handleRefresh
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className={styles.title}>WebDAV Host</div>
      <Space>
        <Select style={{ width: 220 }} value={curSelectServerId} onChange={changeCurSelectServerId}>
          {servers.map(server => (
            <Select.Option key={server.id} value={server.id}>
              {server.alias || server.url}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<IconPlus />} onClick={() => setVisible(true)}>
          Add
        </Button>
        <Button icon={<IconRefresh />} type="primary" onClick={handleRefresh}>
          Refresh
        </Button>
      </Space>
      <WebDavFormModal
        visible={visible}
        onOk={value => {
          changeServers(pre => {
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
