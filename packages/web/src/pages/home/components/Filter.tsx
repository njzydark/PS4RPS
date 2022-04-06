import { Breadcrumb, Button, Input, Radio, Space } from '@arco-design/web-react';
import { IconApps, IconHome, IconList, IconSearch, IconSync } from '@arco-design/web-react/icon';
import { PkgListUIType } from 'common/types/configStore';

import { Divider } from '@/components/Divider';
import { Link } from '@/components/Link';
import { useContainer } from '@/store/container';

import styles from './Filter.module.less';

export const Filter = () => {
  const { fileServer, settings, chnageSettings } = useContainer();
  const { getServerFileListData, paths, setPaths, searchKeyWord, setSearchKeyWord } = fileServer;

  return (
    <div className={styles.wrapper}>
      <div className={styles.filter}>
        <Breadcrumb style={{ display: 'flex', alignItems: 'center' }}>
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
        <Space>
          <Input
            prefix={<IconSearch />}
            placeholder="Input pkg name"
            allowClear
            value={searchKeyWord}
            onChange={setSearchKeyWord}
          />
          <Radio.Group
            type="button"
            value={settings.pkgListUIType}
            onChange={value => chnageSettings({ pkgListUIType: value })}
          >
            <Radio value={PkgListUIType.card}>
              <IconApps />
            </Radio>
            <Radio value={PkgListUIType.table}>
              <IconList />
            </Radio>
          </Radio.Group>
          <Button icon={<IconSync />} type="primary" onClick={() => getServerFileListData()} />
        </Space>
      </div>
      {<Divider style={{ marginBottom: 0 }} />}
    </div>
  );
};
