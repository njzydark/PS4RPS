import { Form, Input, Message, Modal } from '@arco-design/web-react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

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

  const {
    ps4Installer: { ps4Hosts }
  } = useContainer();

  const handleCancel = () => {
    onCancel();
    form.resetFields(undefined);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    form.setFieldsValue(data);
  }, [data]);

  const handleOk = async () => {
    const value = await form.validate();
    if (value) {
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
  };

  return (
    <Modal
      visible={visible}
      title={!data?.id ? 'Create PS4 Host Config' : 'Edit PS4 Host Config'}
      onCancel={handleCancel}
      onOk={handleOk}
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
          rules={[{ required: true, message: 'Please input url' }]}
          extra="For example: http://192.168.0.2:12800, port required, usually 12800"
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};
