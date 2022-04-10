import { Button, Empty, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ConfigCard } from '@/components/ConfigCard';
import { useContainer } from '@/store/container';
import { PS4Host as PS4HostType } from '@/types';

import { FormData, PS4HostFormModal } from './PS4HostFormModal';

export const PS4Host = () => {
  const [searchParams] = useSearchParams();

  const [visible, setVisible] = useState(() => {
    return searchParams.get('openPs4Host') === 'true';
  });
  const [formData, setFormData] = useState<FormData>();

  const { ps4Installer } = useContainer();
  const { ps4Hosts, curSelectPs4HostId, setCurSelectPs4HostId, setPs4Hosts } = ps4Installer;

  const handleAdd = () => {
    setVisible(true);
    setFormData(undefined);
  };

  const handleEdit = (host: PS4HostType) => {
    setVisible(true);
    setFormData({
      id: host.id,
      alias: host.alias,
      url: host.url
    });
  };

  const handleDelete = (host: PS4HostType) => {
    const newHosts = ps4Hosts.filter(h => h.id !== host.id);
    setPs4Hosts(newHosts);
    if (curSelectPs4HostId === host.id) {
      setCurSelectPs4HostId(undefined);
    }
  };

  const handleChangeHost = (host: PS4HostType) => {
    setCurSelectPs4HostId(host.id);
  };

  const handleFormOk = (value: FormData) => {
    setPs4Hosts(pre => {
      const cur = pre.find(item => item.id === value.id);
      const newData: PS4HostType = {
        id: value.id as string,
        url: value.url,
        alias: value.alias
      };
      if (!cur) {
        pre.push(newData);
      } else {
        Object.assign(cur, newData);
      }
      return [...pre];
    });
    if (value.id) {
      setCurSelectPs4HostId(value.id);
    }
  };

  return (
    <div>
      <Typography.Title heading={6} style={{ marginTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PS4 Host</span>
          <Space>
            <Button type="primary" size="small" icon={<IconPlus />} onClick={handleAdd} />
          </Space>
        </div>
      </Typography.Title>
      {!ps4Hosts.length ? (
        <Empty description="Without ps4 host, you can't send install task to ps4" />
      ) : (
        <Space wrap style={{ display: ps4Hosts.length ? 'inline-flex' : 'none' }}>
          {ps4Hosts.map(host => (
            <ConfigCard
              key={host.id}
              title={host.alias || host.url}
              isActive={host.id === curSelectPs4HostId}
              onClick={() => {
                handleChangeHost(host);
              }}
              action={
                <Space size={3}>
                  <ConfigCard.ActionIcon
                    onClick={() => {
                      handleEdit(host);
                    }}
                  >
                    <IconEdit>Edit</IconEdit>
                  </ConfigCard.ActionIcon>
                  <ConfigCard.ActionIcon
                    onClick={() => {
                      handleDelete(host);
                    }}
                  >
                    <IconDelete>Delete</IconDelete>
                  </ConfigCard.ActionIcon>
                </Space>
              }
            />
          ))}
        </Space>
      )}
      <PS4HostFormModal visible={visible} data={formData} onOk={handleFormOk} onCancel={() => setVisible(false)} />
    </div>
  );
};
