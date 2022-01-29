import { Select } from '@arco-design/web-react';
import { Dispatch, SetStateAction } from 'react';

import styles from './PS4Host.module.less';
type Props = {
  ps4BaseUrls: string[];
  curSelectPS4BaseUrl: string;
  changePs4Urls: Dispatch<SetStateAction<string[]>>;
  changeCurSelectPS4BaseUrl: Dispatch<SetStateAction<string>>;
};

export const PS4Host = ({ ps4BaseUrls, curSelectPS4BaseUrl, changePs4Urls, changeCurSelectPS4BaseUrl }: Props) => {
  return (
    <div>
      <div className={styles.title}>PS4 Host</div>
      <div className={styles['input-wrapper']}>
        <Select
          allowCreate
          style={{ width: 220 }}
          value={curSelectPS4BaseUrl}
          onChange={value => {
            if (!ps4BaseUrls.includes(value)) {
              changePs4Urls(pre => [...pre, value]);
            }
            changeCurSelectPS4BaseUrl(value);
          }}
        >
          {ps4BaseUrls.map(url => (
            <Select.Option key={url} value={url}>
              {url}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
