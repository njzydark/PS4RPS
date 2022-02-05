import { Button, Drawer, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlus, IconUnorderedList } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { ConfigCard } from '@/components/ConfigCard';
import { PS4Host as PS4HostType } from '@/types';

import { useContainer } from '../container';
import { InstallTaskList } from './InstallTaskList';
import { FormData, PS4HostFormModal } from './PS4HostFormModal';

export const PS4Host = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>();

  const { ps4Installer, taskListVisible, setTaskListVisible } = useContainer();
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
      <Typography.Title heading={6}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PS4 Host</span>
          <Space>
            <Button size="small" icon={<IconPlus />} onClick={handleAdd} />
            <Button
              size="small"
              type="primary"
              icon={<IconUnorderedList />}
              onClick={() => {
                setTaskListVisible(true);
              }}
            />
          </Space>
        </div>
      </Typography.Title>
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
                <ConfigCard.ActionIcon>
                  <IconEdit
                    onClick={e => {
                      e.stopPropagation();
                      handleEdit(host);
                    }}
                  >
                    Edit
                  </IconEdit>
                </ConfigCard.ActionIcon>
                <ConfigCard.ActionIcon>
                  <IconDelete
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(host);
                    }}
                  >
                    Delete
                  </IconDelete>
                </ConfigCard.ActionIcon>
              </Space>
            }
          />
        ))}
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
      <PS4HostFormModal visible={visible} data={formData} onOk={handleFormOk} onCancel={() => setVisible(false)} />
    </div>
  );
};
