import { Breadcrumb, Button, Input, Notification, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconHome, IconPlus, IconSearch, IconSync } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { ConfigCard } from '@/components/ConfigCard';
import { Link } from '@/components/Link';
import { FileServerHost as IFileServerHost, FileServerType } from '@/types';

import { useContainer } from '../container';
import { FileServerFormModal, FormData } from './FileServerFormModal';
import styles from './FileServerHost.module.less';

export const FileServerHost = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>();

  const { fileServer } = useContainer();
  const {
    fileServerHosts,
    setFileServerHosts,
    curFileServerHostId,
    setCurFileServerHostId,
    setFileServerFiles,
    getFileServerFiles,
    paths,
    setPaths,
    searchKeyWord,
    setSearchKeyWord,
    setIsFileServerReady,
    loading,
    setLoading
  } = fileServer;

  const handleAdd = () => {
    setVisible(true);
    setFormData(undefined);
  };

  const handleEdit = (host: IFileServerHost) => {
    setVisible(true);
    const commonData = {
      id: host.id,
      type: host.type,
      alias: host.alias,
      url: host.url
    };
    if (host.type === FileServerType.WebDAV) {
      setFormData({
        ...commonData,
        password: host.options?.password,
        username: host.options?.username
      });
    } else {
      setFormData({
        ...commonData,
        directoryPath: host?.directoryPath,
        port: host.port
      });
    }
  };

  const handleDelete = (host: IFileServerHost) => {
    const newHosts = fileServerHosts.filter(h => h.id !== host.id);
    setFileServerHosts(newHosts);
    if (curFileServerHostId === host.id) {
      setCurFileServerHostId(undefined);
      setPaths([]);
      setFileServerFiles([]);
      setIsFileServerReady(false);
    }
  };

  const handleChangeHost = async (host: IFileServerHost) => {
    if (loading) {
      return;
    }
    try {
      setCurFileServerHostId(host.id);
      setPaths([]);
      setFileServerFiles([]);
      setIsFileServerReady(false);
      if (host.type === FileServerType.StaticFileServer && window.electron) {
        setLoading(true);
        await window.electron.createStaticFileServer({ directoryPath: host.directoryPath, port: host.port });
        setIsFileServerReady(true);
      } else {
        setTimeout(() => {
          setIsFileServerReady(true);
        }, 0);
      }
    } catch (err) {
      Notification.error({
        title: 'Change file server host error',
        content: (err as Error).message
      });
    }
  };

  const handleFormOk = (value: FormData) => {
    let newData: IFileServerHost;
    const commonData = {
      id: value.id as string,
      url: value.url,
      alias: value.alias
    };
    if (value.type === FileServerType.WebDAV) {
      newData = {
        ...commonData,
        type: value.type,
        options: {
          username: value.username,
          password: value.password
        }
      };
    } else {
      newData = {
        ...commonData,
        type: value.type,
        directoryPath: value.directoryPath as string,
        port: value.port as number
      };
    }
    const cur = fileServerHosts.find(item => item.id === value.id);
    if (!cur) {
      fileServerHosts.push(newData);
    } else {
      Object.assign(cur, newData);
    }
    setFileServerHosts([...fileServerHosts]);
    if (curFileServerHostId === value.id || !cur) {
      handleChangeHost(newData);
    }
  };

  return (
    <div>
      <Typography.Title heading={6}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>File Server Host</span>
          <Button size="small" icon={<IconPlus />} onClick={handleAdd} />
        </div>
      </Typography.Title>
      <Space wrap style={{ display: fileServerHosts.length ? 'inline-flex' : 'none' }}>
        {fileServerHosts.map(host => (
          <ConfigCard
            key={host.id}
            title={host.alias || host.url}
            isActive={host.id === curFileServerHostId}
            onClick={() => handleChangeHost(host)}
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
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={styles['breadcrumb-wrapper']}>
          <Breadcrumb>
            {paths.length === 0 ? (
              <Link>
                <Breadcrumb.Item>
                  <IconHome />
                </Breadcrumb.Item>
              </Link>
            ) : (
              paths.map((path, index) => (
                <Link
                  key={path || '/'}
                  onClick={() => {
                    if (index !== paths.length - 1) {
                      setPaths(paths.slice(0, index + 1));
                    }
                  }}
                >
                  <Breadcrumb.Item key={path || '/'}>
                    {index !== paths.length - 1 ? index === 0 ? <IconHome /> : path : index === 0 ? <IconHome /> : path}
                  </Breadcrumb.Item>
                </Link>
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
          <Button icon={<IconSync />} type="primary" onClick={() => getFileServerFiles(paths.join('/'))} />
        </Space>
      </div>
      <FileServerFormModal visible={visible} data={formData} onOk={handleFormOk} onCancel={() => setVisible(false)} />
    </div>
  );
};
