import { Dropdown, Empty, Menu, Typography } from '@arco-design/web-react';
import { PkgListClickAction } from 'common/types/configStore';

import { formatPkgName } from '@/utils';

import styles from './CardList.module.less';
import { CustomLazyLoadImage } from './CustomLazyLoadImage';
import { TableListProps } from './TableList';

export const CardList = ({ data, handleInstallByActionType, displayPkgRawTitle }: TableListProps) => {
  if (data.length === 0) {
    return <Empty />;
  }

  return (
    <div className={styles['card-list-wrapper']}>
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
              <Menu.Item
                key="2"
                onClick={() => {
                  handleInstallByActionType(item, PkgListClickAction.detail);
                }}
              >
                Detail
              </Menu.Item>
            </Menu>
          }
        >
          <div
            className={styles['item-wrapper']}
            onClick={() => {
              handleInstallByActionType(item, PkgListClickAction.auto);
            }}
          >
            <CustomLazyLoadImage key={item.filename} data={item} />
            <Typography.Text ellipsis={{ rows: 2 }} style={{ marginTop: 10, marginBottom: 0 }}>
              {formatPkgName(item, displayPkgRawTitle)}
            </Typography.Text>
          </div>
        </Dropdown>
      ))}
    </div>
  );
};

export default CardList;
