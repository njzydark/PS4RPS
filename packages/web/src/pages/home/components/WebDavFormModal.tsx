import { Button, Form, Input, InputNumber, Message, Modal, Notification, Radio } from '@arco-design/web-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { useContainer } from '../container';

const FormItem = Form.Item;

type FormData = {
  id?: string;
  alias?: string;
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

export const WebDavFormModal = ({ data, visible, onCancel, onOk }: Props) => {
  const [createType, setCreateType] = useState<'auto' | 'manual'>('auto');

  const [form] = Form.useForm<FormData>();

  const {
    webDAV: { webDavHosts }
  } = useContainer();

  const handleCancel = () => {
    onCancel();
    form.resetFields(undefined);
  };

  const handleOk = async () => {
    const value = await form.validate();
    if (!value) {
      return;
    }
    try {
      if (!value.id) {
        value.id = nanoid();
      }
      if (webDavHosts.find(item => item.url === value.url)) {
        Message.error(`The ${value.url} already exists`);
        return;
      }
      if (createType === 'auto') {
        const res = await window.electron.createWebDavServer({
          directoryPath: value.directoryPath as string,
          port: value.port as number
        });
        if (res?.url) {
          Notification.success({
            title: 'Create WebDav Server Success',
            content: `The server url is ${res.url}`
          });
          value.url = res.url;
        } else {
          Message.error(res?.errorMessage || 'Create webdav server failed');
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
    const res = await window.electron.openDirectoryDialog();
    console.log(res);
    if (res) {
      form.setFieldValue('directoryPath', res);
    }
  };

  return (
    <Modal
      visible={visible}
      title={!data?.id ? 'Create WebDAV Host Config' : 'Edit WebDAV Host Config'}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {window.electron && !data?.id && (
        <Radio.Group type="button" defaultValue={createType} onChange={setCreateType} style={{ marginBottom: 12 }}>
          <Radio value="auto">Auto</Radio>
          <Radio value="manual">Manual</Radio>
        </Radio.Group>
      )}
      <Form form={form} layout="vertical" initialValues={data} requiredSymbol={{ position: 'end' }}>
        <FormItem label="Id" field="id" style={{ display: 'none' }}>
          <Input />
        </FormItem>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        {createType === 'auto' ? (
          <>
            <FormItem
              label="Directory Path"
              field="directoryPath"
              rules={[{ required: true, message: 'Please select directory path' }]}
              shouldUpdate
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
            <FormItem
              label="Port"
              field="port"
              rules={[{ required: true, message: 'Please set port' }]}
              initialValue={1024}
            >
              <InputNumber min={1024} />
            </FormItem>
          </>
        ) : (
          <>
            <FormItem label="URL" field="url" rules={[{ required: true, message: 'Please input url' }]}>
              <Input />
            </FormItem>
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
