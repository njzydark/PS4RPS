import { Button, Empty, Message, Notification, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ConfigCard } from '@/components/ConfigCard';
import { useContainer } from '@/store/container';
import { FileServerHost as IFileServerHost, FileServerType } from '@/types';

import { FileServerFormModal, FormData } from './FileServerFormModal';

export const FileServerHost = () => {
  const [searchParams] = useSearchParams();

  const [visible, setVisible] = useState(() => {
    return searchParams.get('openFileServerHost') === 'true';
  });
  const [formData, setFormData] = useState<FormData>();

  const { fileServer } = useContainer();
  const {
    fileServerHosts,
    setFileServerHosts,
    curFileServerHostId,
    setCurFileServerHostId,
    setFileServerFiles,
    setPaths,
    setIsFileServerReady
  } = fileServer;

  const handleAdd = () => {
    setVisible(true);
    setFormData(undefined);
  };

  const handleEdit = (host: IFileServerHost) => {
    setVisible(true);
    if (host.type === FileServerType.WebDAV) {
      setFormData({
        ...host,
        password: host.options?.password,
        username: host.options?.username
      });
    } else {
      setFormData({
        ...host,
        iface: host.preferredInterface
      });
    }
  };

  const handleDelete = (host: IFileServerHost) => {
    const newHosts = fileServerHosts.filter(h => h.id !== host.id);
    setFileServerHosts(newHosts);
  };

  const handleChangeHost = async (host: IFileServerHost, action: 'Create' | 'Update') => {
    try {
      setCurFileServerHostId(host.id);
      setPaths([]);
      setFileServerFiles([]);
      setIsFileServerReady(false);
      if (host.type === FileServerType.StaticFileServer && window.electron) {
        const res = await window.electron.createStaticFileServer({
          directoryPath: host.directoryPath,
          port: host.port,
          preferredInterface: host.preferredInterface
        });
        if (res?.url) {
          Notification.success({
            title: `${action} File Server Success`,
            content: `The server url is ${res.url}`
          });
          setFileServerHosts(pre => {
            const cur = pre.find(item => item.id === host.id);
            if (cur) {
              cur.url = res.url as string;
            }
            return [...pre];
          });
        } else {
          Message.error(res?.errorMessage || `${action} file server failed`);
          return;
        }
      }
      setIsFileServerReady(true);
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
        recursiveQuery: value.recursiveQuery,
        options: {
          username: value.username,
          password: value.password
        }
      };
    } else {
      newData = {
        ...commonData,
        type: value.type,
        recursiveQuery: value.recursiveQuery,
        directoryPath: value.directoryPath as string,
        port: value.port as number,
        preferredInterface: value.iface
      };
    }
    const cur = fileServerHosts.find(item => item.id === value.id);
    if (!cur) {
      fileServerHosts.push(newData);
    } else {
      Object.assign(cur, newData);
    }
    setFileServerHosts([...fileServerHosts]);
    if (!cur) {
      handleChangeHost(newData, 'Create');
    } else if (curFileServerHostId === value.id) {
      handleChangeHost(newData, 'Update');
    }
  };

  return (
    <div>
      <Typography.Title heading={6} style={{ marginTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>File Server Host</span>
          <Button type="primary" size="small" icon={<IconPlus />} onClick={handleAdd} />
        </div>
      </Typography.Title>
      {!fileServerHosts.length ? (
        <Empty description="Without file server host, you can't visit ps4 pkg file" />
      ) : (
        <Space wrap style={{ display: fileServerHosts.length ? 'inline-flex' : 'none' }}>
          {fileServerHosts.map(host => (
            <ConfigCard
              key={host.id}
              title={host.alias || host.url || ('directoryPath' in host ? host.directoryPath : '')}
              isActive={host.id === curFileServerHostId}
              onClick={() => handleChangeHost(host, 'Update')}
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
      <FileServerFormModal visible={visible} data={formData} onOk={handleFormOk} onCancel={() => setVisible(false)} />
    </div>
  );
};
