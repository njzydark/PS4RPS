import { Breadcrumb, Button, Input, Notification, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconHome, IconPlus, IconSearch, IconSync } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { ConfigCard } from '@/components/ConfigCard';
import { WebDAVHost } from '@/types';

import { useContainer } from '../container';
import { FormData, WebDavFormModal } from './WebDavFormModal';
import styles from './WebDavHost.module.less';

export const WebDavHost = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>();

  const { webDAV } = useContainer();
  const {
    webDavHosts,
    curSelectWebDavHostId,
    paths,
    setWebDavHosts,
    setCurSelectWebDavHostId,
    getWebDavHostFiles,
    setPaths,
    searchKeyWord,
    setSearchKeyWord
  } = webDAV;

  const handleAdd = () => {
    setVisible(true);
    setFormData(undefined);
  };

  const handleEdit = (host: WebDAVHost) => {
    setVisible(true);
    setFormData({
      id: host.id,
      alias: host.alias,
      url: host.url,
      directoryPath: host.directoryPath,
      password: host.options?.password,
      port: host.port,
      username: host.options?.username
    });
  };

  const handleDelete = (host: WebDAVHost) => {
    const newHosts = webDavHosts.filter(h => h.id !== host.id);
    setWebDavHosts(newHosts);
    if (curSelectWebDavHostId === host.id) {
      setCurSelectWebDavHostId(undefined);
    }
  };

  const handleChangeHost = (host: WebDAVHost) => {
    try {
      if (host.directoryPath && host.port) {
        window.electron.createWebDavServer({ directoryPath: host.directoryPath, port: host.port });
      }
      setCurSelectWebDavHostId(host.id);
      setPaths([]);
    } catch (err) {
      Notification.error({
        title: 'Change host error',
        content: (err as Error).message
      });
    }
  };

  const handleFormOk = (value: FormData) => {
    setWebDavHosts(pre => {
      const cur = pre.find(item => item.id === value.id);
      const newData: WebDAVHost = {
        id: value.id as string,
        url: value.url,
        alias: value.alias,
        directoryPath: value.directoryPath,
        port: value.port,
        options: {
          username: value.username,
          password: value.password
        }
      };
      if (!cur) {
        pre.push(newData);
      } else {
        Object.assign(cur, newData);
      }
      return [...pre];
    });
    if (value.id) {
      setCurSelectWebDavHostId(value.id);
      setPaths([]);
    }
  };

  return (
    <div>
      <Typography.Title heading={6}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>WebDAV Host</span>
          <Button size="small" icon={<IconPlus />} onClick={handleAdd} />
        </div>
      </Typography.Title>
      <Space wrap style={{ display: webDavHosts.length ? 'inline-flex' : 'none' }}>
        {webDavHosts.map(host => (
          <ConfigCard
            key={host.id}
            title={host.alias || host.url}
            isActive={host.id === curSelectWebDavHostId}
            onClick={() => handleChangeHost(host)}
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
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={styles['breadcrumb-wrapper']}>
          <Breadcrumb>
            {paths.length === 0 ? (
              <Breadcrumb.Item>
                <IconHome />
              </Breadcrumb.Item>
            ) : (
              paths.map((path, index) => (
                <Breadcrumb.Item key={path || '/'}>
                  {index !== paths.length - 1 ? (
                    <a
                      onClick={() => {
                        setPaths(paths.slice(0, index + 1));
                      }}
                    >
                      {index === 0 ? <IconHome /> : path}
                    </a>
                  ) : index === 0 ? (
                    <IconHome />
                  ) : (
                    path
                  )}
                </Breadcrumb.Item>
              ))
            )}
          </Breadcrumb>
        </div>
        <Space>
          <Input
            prefix={<IconSearch />}
            placeholder="Input file name"
            allowClear
            value={searchKeyWord}
            onChange={setSearchKeyWord}
          />
          <Button icon={<IconSync />} type="primary" onClick={() => getWebDavHostFiles(paths.join('/'))} />
        </Space>
      </div>
      <WebDavFormModal visible={visible} data={formData} onOk={handleFormOk} onCancel={() => setVisible(false)} />
    </div>
  );
};
