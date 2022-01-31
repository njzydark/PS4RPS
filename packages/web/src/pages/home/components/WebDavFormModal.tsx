import { Form, Input, Message, Modal } from '@arco-design/web-react';
import { nanoid } from 'nanoid';

import { useContainer } from '../container';

const FormItem = Form.Item;

type FormData = { id?: string; alias?: string; url: string; username?: string; password?: string };

type Props = {
  data?: FormData;
  visible: boolean;
  onOk: (data: FormData) => void;
  onCancel: () => void;
};

export const WebDavFormModal = ({ data, visible, onCancel, onOk }: Props) => {
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
    if (value) {
      if (webDavHosts.find(item => item.url === value.url)) {
        Message.error(`The ${value.url} already exists`);
        return;
      }
      if (!value.id) {
        value.id = nanoid();
      }
      onOk(value);
      handleCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      title={!data?.id ? 'Create WebDAV Host Config' : 'Edit WebDAV Host Config'}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical" initialValues={data} requiredSymbol={{ position: 'end' }}>
        <FormItem label="Id" field="id" style={{ display: 'none' }}>
          <Input />
        </FormItem>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        <FormItem label="URL" field="url" rules={[{ required: true, message: 'Please input url' }]}>
          <Input />
        </FormItem>
        <FormItem label="Username" field="username">
          <Input />
        </FormItem>
        <FormItem label="Password" field="password">
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};
