import { Select, Space, Typography } from '@arco-design/web-react';

import { useContainer } from '../container';

export const PS4Host = () => {
  const { ps4Installer } = useContainer();
  const { ps4BaseUrls, curSelectPS4BaseUrl, setCurSelectPS4BaseUrl, setPs4BaseUrls } = ps4Installer;

  return (
    <div>
      <Typography.Title heading={6}>PS4 Host</Typography.Title>
      <Space>
        <Select
          allowCreate
          style={{ width: 220 }}
          value={curSelectPS4BaseUrl}
          onChange={value => {
            if (!ps4BaseUrls.includes(value)) {
              setPs4BaseUrls(pre => [...pre, value]);
            }
            setCurSelectPS4BaseUrl(value);
          }}
        >
          {ps4BaseUrls.map(url => (
            <Select.Option key={url} value={url}>
              {url}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </div>
  );
};
