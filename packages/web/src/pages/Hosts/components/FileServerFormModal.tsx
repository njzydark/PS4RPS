import { Button, Form, Input, InputNumber, Message, Modal, Notification, Radio } from '@arco-design/web-react';
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
};

type Props = {
  data?: FormData;
  visible: boolean;
  onOk: (data: FormData) => void;
  onCancel: () => void;
};

export const FileServerFormModal = ({ data, visible, onCancel, onOk }: Props) => {
  const [createType, setCreateType] = useState<FileServerType>(
    window.electron ? FileServerType.StaticFileServer : FileServerType.WebDAV
  );

  const [form] = Form.useForm<FormData>();

  const {
    fileServer: { fileServerHosts }
  } = useContainer();

  const handleCancel = () => {
    onCancel();
    setCreateType(window.electron ? FileServerType.StaticFileServer : FileServerType.WebDAV);
    form.resetFields(undefined);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.id && data?.type) {
      setCreateType(data.type);
    }
    form.setFieldsValue(data);
  }, [data]);

  const handleOk = async () => {
    const value = await form.validate();
    if (!value) {
      return;
    }
    try {
      if (createType === FileServerType.StaticFileServer) {
        if (value.url) {
          try {
            const { port, protocol } = new URL(value.url);
            value.port = port ? Number(port) : protocol === 'https:' ? 443 : 80;
          } catch (err) {
            return Message.error(`Please input valid url: ${(err as Error).message}`);
          }
        }
      }
      const actionName = value.id ? 'Update' : 'Create';
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
        value.type = createType;
      }
      if (value.type === FileServerType.StaticFileServer && value.directoryPath && window.electron) {
        const res = await window.electron.createStaticFileServer({
          directoryPath: value.directoryPath as string,
          port: value.port as number
        });
        if (res?.url) {
          Notification.success({
            title: `${actionName} File Server Success`,
            content: `The server url is ${res.url}`
          });
          value.url = res.url;
        } else {
          Message.error(res?.errorMessage || `${actionName} file server failed`);
          return;
        }
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
    console.log(res);
    if (res) {
      form.setFieldValue('directoryPath', res);
    }
  };

  return (
    <Modal
      visible={visible}
      title={!data?.id ? 'Create File Server Host Config' : 'Edit File Server Host Config'}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {!data?.id && (
        <Radio.Group type="button" value={createType} onChange={setCreateType} style={{ marginBottom: 12 }}>
          <Radio value={FileServerType.StaticFileServer}>Static File Server</Radio>
          <Radio value={FileServerType.WebDAV}>WebDAV</Radio>
        </Radio.Group>
      )}
      <Form form={form} layout="vertical" initialValues={undefined} requiredSymbol={{ position: 'end' }}>
        <FormItem label="Id" field="id" style={{ display: 'none' }}>
          <Input />
        </FormItem>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        {(createType === FileServerType.WebDAV || !window.electron) && (
          <FormItem
            label="URL"
            field="url"
            rules={[{ required: true, message: 'Please input url' }]}
            extra="For example: http://example.com"
          >
            <Input />
          </FormItem>
        )}
        {createType === FileServerType.StaticFileServer ? (
          window.electron ? (
            <>
              <FormItem label="Directory Path" field="directoryPath" shouldUpdate>
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
              <Input />
            </FormItem>
          </>
        )}
      </Form>
    </Modal>
  );
};
