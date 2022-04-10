import { Dropdown, Empty, Image, Menu, Typography } from '@arco-design/web-react';
import { PkgListClickAction } from 'common/types/configStore';

import FolderIcon from '@/assets/folder.png';
import Ps4Icon from '@/assets/ps4-icon.png';

import styles from './CardList.module.less';
import { TableListProps } from './TableList';

export const CardList = ({ data, handleNameClick, formatPkgName }: TableListProps) => {
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
                  handleNameClick(item, PkgListClickAction.install);
                }}
              >
                Install
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => {
                  handleNameClick(item, PkgListClickAction.detail);
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
              handleNameClick(item);
            }}
          >
            <Image
              loader
              loading="lazy"
              className={styles['icon']}
              src={item.type === 'directory' ? FolderIcon : item.icon0 || Ps4Icon}
              width="100%"
              preview={false}
            />
            <Typography.Text ellipsis={{ rows: 2 }} style={{ marginTop: 10, marginBottom: 0 }}>
              {formatPkgName(item)}
            </Typography.Text>
          </div>
        </Dropdown>
      ))}
    </div>
  );
};

export default CardList;
