import { Breadcrumb, Button, Input, Radio, Space } from '@arco-design/web-react';
import { IconApps, IconHome, IconList, IconSearch, IconSync } from '@arco-design/web-react/icon';
import { PkgListUIType } from 'common/types/configStore';

import { Divider } from '@/components/Divider';
import { EllipsisText } from '@/components/EllipsisText';
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
            <Breadcrumb.Item>
              <Link>
                <IconHome />
              </Link>
            </Breadcrumb.Item>
          ) : (
            paths.map((path, index) => (
              <Breadcrumb.Item key={path || '/'}>
                <Link
                  onClick={() => {
                    if (index !== paths.length - 1) {
                      setPaths(paths.slice(0, index + 1));
                    }
                  }}
                >
                  {index !== paths.length - 1 ? (
                    index === 0 ? (
                      <IconHome />
                    ) : (
                      <EllipsisText text={path} />
                    )
                  ) : index === 0 ? (
                    <IconHome />
                  ) : (
                    <EllipsisText text={path} />
                  )}
                </Link>
              </Breadcrumb.Item>
            ))
          )}
        </Breadcrumb>
        <Space style={{ flexShrink: 0 }}>
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
