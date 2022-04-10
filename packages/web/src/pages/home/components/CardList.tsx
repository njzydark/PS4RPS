import { Empty, Image, Typography } from '@arco-design/web-react';

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
        <div
          key={item.filename}
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
      ))}
    </div>
  );
};

export default CardList;
