import { Dropdown, Empty, Menu } from '@arco-design/web-react';
import { PkgListClickAction } from 'common/types/configStore';

import { formatFileSize } from '@/utils';

import { CustomLazyLoadImage } from './CustomLazyLoadImage';
import styles from './SimpleList.module.less';
import { TableListProps } from './TableList';

export const SimpleList = ({ data = [], handleInstallByActionType }: TableListProps) => {
  if (data.length === 0) {
    return <Empty />;
  }

  return (
    <div className={styles['simple-list-wrapper']}>
      {data.map(item => (
        <Dropdown
          key={item.filename}
          trigger="contextMenu"
          position="bl"
          disabled={item.type === 'directory'}
          droplist={
            <Menu>
              <Menu.Item
                key="1"
                onClick={() => {
                  handleInstallByActionType(item, PkgListClickAction.install);
                }}
              >
                Install
              </Menu.Item>
              <Menu.Item key="2" onClick={() => {}}>
                Select
              </Menu.Item>
            </Menu>
          }
        >
          <div
            className={styles['item-wrapper']}
            onClick={() => {
              handleInstallByActionType(item, PkgListClickAction.install);
            }}
          >
            <CustomLazyLoadImage data={item} className={styles['img-wrapper']} />
            <div className={styles['info-wrapper']}>
              <span title={item.paramSfo?.TITLE} className={styles.title}>
                {item.paramSfo?.TITLE}
              </span>
              <span>
                {item.paramSfo?.APP_VER || item.paramSfo?.VERSION || '-'}
                {' - '}
                {formatFileSize(item.size) || '-'}
              </span>
              <span title={item.paramSfo?.CONTENT_ID}>{item.paramSfo?.CONTENT_ID || '-'}</span>
            </div>
          </div>
        </Dropdown>
      ))}
    </div>
  );
};
