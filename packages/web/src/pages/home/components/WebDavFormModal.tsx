import { Form, Input, Message, Modal } from '@arco-design/web-react';

import { useContainer } from '../container';

const FormItem = Form.Item;

type FormData = { alias?: string; url: string; username?: string; password?: string };

type Props = {
  data?: FormData;
  type?: 'create' | 'edit';
  visible: boolean;
  onOk: (data: FormData) => void;
  onCancel: () => void;
};

export const WebDavFormModal = ({ data, visible, type = 'create', onCancel, onOk }: Props) => {
  const [form] = Form.useForm<FormData>();

  const {
    webDAV: { webDavHosts }
  } = useContainer();

  const handleOk = async () => {
    const value = await form.validate();
    if (value) {
      if (webDavHosts.find(item => item.url === value.url)) {
        Message.error(`The ${value.url} already exists`);
        return;
      }
      onOk(value);
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      title={type === 'create' ? 'Create WebDAV Config' : 'Edit WebDAV Config'}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical" initialValues={data} requiredSymbol={{ position: 'end' }}>
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
