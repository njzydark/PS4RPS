import { Dropdown, Empty, Menu, Spin, Typography } from '@arco-design/web-react';
import { PkgListClickAction } from 'common/types/configStore';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import FolderIcon from '@/assets/folder.png';
import Ps4Icon from '@/assets/ps4-icon.png';
import { FileStat } from '@/types';

import styles from './CardList.module.less';
import { TableListProps } from './TableList';

const CustomImage = ({ data }: { data: FileStat }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className={styles['img-wrapper']}>
      <LazyLoadImage
        src={data.type === 'directory' ? FolderIcon : data.icon0 || Ps4Icon}
        afterLoad={() => {
          setLoading(false);
        }}
      />
      {loading && (
        <div className={styles['loading-wrapper']}>
          <Spin />
        </div>
      )}
    </div>
  );
};

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
            <CustomImage key={item.filename} data={item} />
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
