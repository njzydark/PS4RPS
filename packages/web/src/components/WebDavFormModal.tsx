import { Form, Input, Modal } from '@arco-design/web-react';

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

  const handleOk = async () => {
    const value = await form.validate();
    if (value) {
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
      <Form form={form} layout="vertical" initialValues={data}>
        <FormItem label="Alias" field="alias">
          <Input />
        </FormItem>
        <FormItem label="URL" field="url" required>
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
