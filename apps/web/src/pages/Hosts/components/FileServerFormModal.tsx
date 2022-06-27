import { Button, Drawer, Form, Input, InputNumber, Message, Radio, Select, Switch } from '@arco-design/web-react';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

import { useContainer } from '@/store/container';
import { FileServerType } from '@/types';

const FormItem = Form.Item;

export type FormData = {
  id?: string;
  alias?: string;
  type: FileServerType;
  url: string;
  username?: string;
  password?: string;
  directoryPath?: string;
  port?: number;
  iface?: string;
  recursiveQuery?: boolean;
};

type Props = {
  data?: FormData;
  visible: boolean;
  onOk: (data: FormData) => void;
  onCancel: () => void;
};

export const FileServerFormModal = ({ data, visible, onCancel, onOk }: Props) => {
  const {
    fileServer: { fileServerHosts }
  } = useContainer();

  const [form] = Form.useForm<FormData>();

  const [fileServerType, setFileServerType] = useState<FileServerType>(
    window.electron ? FileServerType.StaticFileServer : FileServerType.WebDAV
  );

  const [protocol, setProtocol] = useState<'http://' | 'https://'>('http://');

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (data?.id) {
      setFileServerType(data.type);
      setProtocol(data.url.startsWith('https://') ? 'https://' : 'http://');
      data.url = data.url.replace(/^https?:\/\//g, '');
      form.setFieldsValue(data);
    } else {
      form.setFieldsValue({
        recursiveQuery: fileServerType === FileServerType.WebDAV ? false : true
      });
    }
  }, [data, visible, fileServerType]);

  const [ifaces, setIfaces] = useState<string[]>([]);
  const [interfacesLoading, setInterfacesLoading] = useState(() => {
    return Boolean(window.electron);
  });

  useEffect(() => {
    if (window.electron && visible) {
      window.electron
        .getAvailableInterfaces()
        .then(ifaces => {
          if (Array.isArray(ifaces) && ifaces.length) {
            setIfaces(ifaces.map(i => i.ipv4));
            if (!data?.id) {
              form.setFieldValue('iface', ifaces[0].ipv4);
            }
          } else {
            setIfaces([]);
          }
        })
        .finally(() => {
          setInterfacesLoading(false);
        });
    }
  }, [visible, data]);

  const handleCancel = () => {
    setFileServerType(window.electron ? FileServerType.StaticFileServer : FileServerType.WebDAV);
    setProtocol('http://');
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    const value = await form.validate();
    if (!value) {
      return;
    }
    try {
      if (value.url) {
        value.url = protocol + value.url.trim().replace(/\/$/, '');
      }
      if (fileServerType === FileServerType.StaticFileServer) {
        if (value.url) {
          try {
            const { port, protocol } = new URL(value.url);
            value.port = port ? Number(port) : protocol === 'https:' ? 443 : 80;
          } catch (err) {
            return Message.error(`Please input valid url: ${(err as Error).message}`);
          }
        }
      }
      if (!value.id) {
        value.id = nanoid();
        if (fileServerHosts.find(item => item.url === value.url)) {
          Message.error(`The ${value.url} already exists`);
          return;
        }
        if (
          fileServerHosts.find(
            item =>
              item.type === FileServerType.StaticFileServer &&
              item.directoryPath &&
              item.directoryPath === value.directoryPath
          )
        ) {
          Message.error(`The ${value.directoryPath} already exists`);
          return;
        }
      }
      if (!value.type) {
        value.type = fileServerType;
      }
      onOk(value);
      handleCancel();
    } catch (err) {
      Message.error((err as Error).message);
    }
  };

  const handleSelectDirectory = async () => {
    if (!window.electron) {
      return;
    }
    const res = await window.electron.openDirectoryDialog();
    if (res) {
      form.setFieldValue('directoryPath', res);
    }
  };

  return (
    <Drawer
      visible={visible}
      title={!data?.id ? 'Create File Server Host Config' : 'Edit File Server Host Config'}
      onCancel={handleCancel}
      onOk={handleOk}
      width="50%"
    >
      {!data?.id && (
        <Radio.Group type="button" value={fileServerType} onChange={setFileServerType} style={{ marginBottom: 12 }}>
          <Radio value={FileServerType.StaticFileServer}>Static File Server</Radio>
          <Radio value={FileServerType.WebDAV}>WebDAV</Radio>
        </Radio.Group>
      )}
      <Form form={form} layout="vertical" requiredSymbol={{ position: 'end' }}>
        <FormItem label="Id" field="id" style={{ display: 'none' }}>
          <Input />
        </FormItem>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        {(fileServerType === FileServerType.WebDAV || !window.electron) && (
          <FormItem
            label="URL"
            field="url"
            rules={[{ required: true, message: 'Please input url' }]}
            extra="For example: http://example.com"
          >
            <Input
              autoFocus
              addBefore={
                <Select value={protocol} style={{ width: 100 }} onChange={setProtocol}>
                  <Select.Option value="http://">http://</Select.Option>
                  <Select.Option value="https://">https://</Select.Option>
                </Select>
              }
            />
          </FormItem>
        )}
        {fileServerType === FileServerType.StaticFileServer ? (
          window.electron ? (
            <>
              <FormItem label="Network Interface" field="iface">
                {(value: FormData) => {
                  return <Select options={ifaces} allowClear loading={interfacesLoading} defaultValue={value.iface} />;
                }}
              </FormItem>
              <FormItem
                label="Directory Path"
                field="directoryPath"
                shouldUpdate
                rules={[{ required: true, message: 'Please select directory' }]}
              >
                {(values: FormData) => (
                  <>
                    <Button type="primary" onClick={handleSelectDirectory}>
                      Select directory
                    </Button>
                    {values.directoryPath && <div style={{ marginTop: 8 }}>{values.directoryPath}</div>}
                  </>
                )}
              </FormItem>
              <FormItem label="Port" field="port" initialValue={1090}>
                <InputNumber min={1024} />
              </FormItem>
            </>
          ) : null
        ) : (
          <>
            <FormItem label="Username" field="username">
              <Input />
            </FormItem>
            <FormItem label="Password" field="password">
              <Input.Password />
            </FormItem>
          </>
        )}
        <FormItem
          label="Recursive Query"
          field="recursiveQuery"
          triggerPropName="checked"
          extra={
            fileServerType === FileServerType.WebDAV
              ? 'Enable recursive query need your webdav server enable DavDepthInfinity'
              : ''
          }
        >
          <Switch />
        </FormItem>
      </Form>
    </Drawer>
  );
};
