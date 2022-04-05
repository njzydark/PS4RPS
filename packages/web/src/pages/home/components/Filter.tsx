import { Breadcrumb, Button, Input, Space } from '@arco-design/web-react';
import { IconHome, IconSearch, IconSync } from '@arco-design/web-react/icon';

import { Link } from '@/components/Link';
import { useContainer } from '@/store/container';

export const Filter = () => {
  const { fileServer } = useContainer();
  const { getFileServerFiles, paths, setPaths, searchKeyWord, setSearchKeyWord } = fileServer;

  return (
    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff'
        }}
      >
        <Breadcrumb>
          {paths.length === 0 ? (
            <Link>
              <Breadcrumb.Item>
                <IconHome />
              </Breadcrumb.Item>
            </Link>
          ) : (
            paths.map((path, index) => (
              <Link
                key={path || '/'}
                onClick={() => {
                  if (index !== paths.length - 1) {
                    setPaths(paths.slice(0, index + 1));
                  }
                }}
              >
                <Breadcrumb.Item key={path || '/'}>
                  {index !== paths.length - 1 ? index === 0 ? <IconHome /> : path : index === 0 ? <IconHome /> : path}
                </Breadcrumb.Item>
              </Link>
            ))
          )}
        </Breadcrumb>
      </div>
      <Space>
        <Input
          prefix={<IconSearch />}
          placeholder="Input file name"
          allowClear
          value={searchKeyWord}
          onChange={setSearchKeyWord}
        />
        <Button icon={<IconSync />} type="primary" onClick={() => getFileServerFiles(paths.join('/'))} />
      </Space>
    </div>
  );
};
