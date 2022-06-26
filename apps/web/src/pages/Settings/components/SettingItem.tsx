import { Typography } from '@arco-design/web-react';
import { ReactNode } from 'react';

import { Divider } from '@/components/Divider';

const { Title, Text } = Typography;

type Props = {
  title: ReactNode;
  desc?: ReactNode;
  children: ReactNode;
};

export const SettingItem = ({ title, desc, children }: Props) => {
  return (
    <>
      <div>
        <Title heading={6}>{title}</Title>
        {desc && (
          <Text
            style={{
              wordBreak: 'break-word'
            }}
          >
            {desc}
          </Text>
        )}
        <div style={{ marginTop: 8, maxWidth: 120 }}>{children}</div>
      </div>
      <Divider />
    </>
  );
};
