import { Alert, Button, Form, Input, Message, Modal, Notification, Space } from '@arco-design/web-react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

import { RPILink } from '@/components/WebAlert';
import { useContainer } from '@/store/container';

const FormItem = Form.Item;

export type FormData = { id?: string; alias?: string; url: string };

type Props = {
  data?: FormData;
  visible: boolean;
  onOk: (data: FormData) => void;
  onCancel: () => void;
};

export const PS4HostFormModal = ({ data, visible, onCancel, onOk }: Props) => {
  const [form] = Form.useForm<FormData>();

  const [testLoading, setTestLoading] = useState(false);

  const {
    ps4Installer: { ps4Hosts }
  } = useContainer();

  const handleCancel = () => {
    onCancel();
    form.resetFields(undefined);
    setTestLoading(false);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    data.url = data.url.replace(/^https?:\/\//g, '');
    form.setFieldsValue(data);
  }, [data]);

  const handleOk = async (isTest = false) => {
    try {
      const value = await form.validate();
      if (value) {
        value.url =
          'http://' +
          value.url
            .trim()
            .replace(/^https?:\/\//g, '')
            .replace(/\/$/, '');
        if (isTest) {
          setTestLoading(true);
          try {
            await axios.get(value.url + '/api', { timeout: 3000 });
            throw new Error('failed');
          } catch (err) {
            // @ts-ignore
            if (err?.response?.status === 400 || err?.response?.data?.status === 'fail') {
              Notification.success({
                title: 'Connect to PS4 host success',
                content: ''
              });
            } else {
              Notification.error({
                title: 'Connect to PS4 host failed',
                content: 'Please check if the ip and port are correct or rempte pkg installer is running on your ps4'
              });
            }
          }
          return;
        }
        if (!value.id) {
          value.id = nanoid();
          if (ps4Hosts.find(item => item.url === value.url)) {
            Message.error(`The ${value.url} already exists`);
            return;
          }
        }
        onOk(value);
        handleCancel();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={!data?.id ? 'Create PS4 Host Config' : 'Edit PS4 Host Config'}
      onCancel={handleCancel}
      footer={
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={() => {
              handleOk(true);
            }}
            loading={testLoading}
          >
            Connect Test
          </Button>
          <Button type="primary" onClick={() => handleOk()}>
            Confirm
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" initialValues={undefined} requiredSymbol={{ position: 'end' }}>
        <FormItem label="Id" field="id" style={{ display: 'none' }}>
          <Input />
        </FormItem>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        <FormItem
          label="URL"
          field="url"
          rules={[{ required: true, message: 'Please input ps4 ip and port' }]}
          extra="For example: 192.168.0.2:12800, port is required, usually is 12800 or 12801"
        >
          <Input addBefore="http://" autoFocus />
        </FormItem>
        {!data?.id && (
          <Alert
            type="info"
            content={
              <>
                I recommend using my modified Remote Pkg Installer on your ps4. This version fixes the problem that the
                path with spaces or Chinese characters cannot be installed, and adds ip and port tips at startup:{' '}
                <RPILink /> (default port is 12801)
              </>
            }
          />
        )}
      </Form>
    </Modal>
  );
};
