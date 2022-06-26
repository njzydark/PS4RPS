import { Image } from '@arco-design/web-react';

import Ps4Icon from '@/assets/ps4-icon.png';
import { FileStat } from '@/types';
import { formatFileSize } from '@/utils';

import styles from './BasicInfo.module.less';

export const BasicInfo = ({ data }: { data?: FileStat }) => {
  if (!data) {
    return null;
  }

  return (
    <div className={styles['base-info-wrapper']}>
      <Image style={{ marginRight: 12 }} src={data?.icon0 || Ps4Icon} width={128} />
      <div className={styles.info}>
        <div className={styles.item}>
          <div>Title</div>
          <div>{data?.paramSfo?.TITLE || '-'}</div>
        </div>
        <div className={styles.item}>
          <div>TitleID</div>
          <div>{data?.paramSfo?.TITLE_ID || '-'}</div>
        </div>
        <div className={styles.item}>
          <div>Version</div>
          <div>{data?.paramSfo?.APP_VER || data?.paramSfo?.VERSION || '-'}</div>
        </div>
        <div className={styles.item}>
          <div>Category</div>
          <div>{data?.paramSfo?.CATEGORY || '-'}</div>
        </div>
        <div className={styles.item}>
          <div>Size</div>
          <div>{formatFileSize(data.size) || '-'}</div>
        </div>
      </div>
    </div>
  );
};
