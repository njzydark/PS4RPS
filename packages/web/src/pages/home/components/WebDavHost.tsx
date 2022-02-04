import { Breadcrumb, Button, Input, Select, Space, Typography } from '@arco-design/web-react';
import { IconHome, IconPlus, IconSearch, IconSync } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { useContainer } from '../container';
import { WebDavFormModal } from './WebDavFormModal';
import styles from './WebDavHost.module.less';

export const WebDavHost = () => {
  const [visible, setVisible] = useState(false);

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

  return (
    <div>
      <Typography.Title heading={6}>WebDAV Host</Typography.Title>
      <Space>
        <Select
          style={{ width: 220 }}
          value={curSelectWebDavHostId}
          onChange={id => {
            setCurSelectWebDavHostId(id);
            setPaths([]);
          }}
        >
          {webDavHosts.map(host => (
            <Select.Option key={host.id} value={host.id}>
              {host.alias || host.url}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<IconPlus />} onClick={() => setVisible(true)} />
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
      <WebDavFormModal
        visible={visible}
        onOk={value => {
          setWebDavHosts(pre => {
            pre.push({
              id: value.id as string,
              url: value.url,
              alias: value.alias,
              directoryPath: value.directoryPath,
              port: value.port,
              options: {
                username: value.username,
                password: value.password
              }
            });
            return pre;
          });
          if (value.id) {
            setCurSelectWebDavHostId(value.id);
            setPaths([]);
          }
        }}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};
