import { Breadcrumb, Button, Input, Menu, Radio, Space } from '@arco-design/web-react';
import { IconApps, IconHome, IconList, IconSearch, IconSync } from '@arco-design/web-react/icon';
import cs from 'classnames';
import { PkgListUIType } from 'common/types/configStore';
import { useRef } from 'react';

import { Divider } from '@/components/Divider';
import { Link } from '@/components/Link';
import { useIsOverflow } from '@/hooks/useIsOverflow';
import { useContainer } from '@/store/container';

import styles from './Filter.module.less';

export const Filter = () => {
  const { fileServer, settings, chnageSettings } = useContainer();
  const { getServerFileListData, paths, setPaths, searchKeyWord, setSearchKeyWord, loading, pkgInfoDataLoading } =
    fileServer;

  const breadcrumbRef = useRef(null);

  const isOverflow = useIsOverflow(breadcrumbRef, { isVerticalOverflow: false });
  const isBreadcrumbOverflow = isOverflow && paths.length > 2;

  return (
    <div className={styles.wrapper}>
      <div className={styles.filter} style={{ position: 'relative' }}>
        <Breadcrumb
          ref={breadcrumbRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            marginRight: 10,
            visibility: isBreadcrumbOverflow ? 'hidden' : 'visible'
          }}
        >
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
                  style={{ whiteSpace: 'nowrap' }}
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
                      <span title={path}>{path}</span>
                    )
                  ) : index === 0 ? (
                    <IconHome />
                  ) : (
                    <span title={path}>{path}</span>
                  )}
                </Link>
              </Breadcrumb.Item>
            ))
          )}
        </Breadcrumb>
        {isBreadcrumbOverflow && (
          <Breadcrumb
            style={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              marginRight: 10,
              position: 'absolute'
            }}
          >
            <Breadcrumb.Item key={'/'}>
              <Link
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  setPaths(paths.slice(0, 1));
                }}
              >
                <IconHome />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item
              key={paths.length - 1}
              droplist={
                <Menu style={{ maxWidth: 400 }}>
                  {paths.slice(1).map((path, index) => (
                    <Menu.Item
                      key={path}
                      onClick={() => {
                        setPaths(paths.slice(0, index + 2));
                      }}
                    >
                      {path}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Link style={{ whiteSpace: 'nowrap' }}>
                <span title={paths[paths.length - 1]}>{paths[paths.length - 1]}</span>
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
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
      {
        <Divider
          style={{ marginBottom: 0 }}
          className={cs(
            loading && styles['loading-line'],
            !loading && pkgInfoDataLoading && styles['loading-line-purple']
          )}
        />
      }
    </div>
  );
};
