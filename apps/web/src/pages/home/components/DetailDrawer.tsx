import { Button, Drawer, Image, Table } from '@arco-design/web-react';
import { IconSend } from '@arco-design/web-react/icon';

import Ps4Icon from '@/assets/ps4-icon.png';
import { FileStat } from '@/types';

import styles from './DetailDrawer.module.less';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  handleInstall: (fileStat: FileStat) => Promise<void>;
  data?: FileStat;
};

export const DetailDrawer = ({ visible, data, handleCancel, handleInstall }: Props) => {
  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      ellipsis: true
    },
    {
      title: 'Value',
      dataIndex: 'value',
      ellipsis: true
    }
  ];

  const tableData = Object.entries(data?.paramSfo || {}).map(val => ({
    key: val[0],
    value: val[1]
  }));

  return (
    <Drawer
      className={styles.wrapper}
      visible={visible}
      onCancel={handleCancel}
      title={data?.basename?.replace(/\.pkg$/g, '')}
      width={500}
      footer={
        <Button
          icon={<IconSend />}
          type="primary"
          onClick={() => {
            data && handleInstall(data);
          }}
        >
          Send install task
        </Button>
      }
    >
      <div className={styles['base-info-wrapper']}>
        <Image style={{ marginRight: 12 }} src={data?.icon0 || Ps4Icon} width={128} />
        <div className={styles.info}>
          <div className={styles.item}>
            <div>Title</div>
            <div>{data?.paramSfo?.TITLE || '-'}</div>
          </div>
          <div className={styles.item}>
            <div>Version</div>
            <div>{data?.paramSfo?.APP_VER || '-'}</div>
          </div>
          <div className={styles.item}>
            <div>Category</div>
            <div>{data?.paramSfo?.CATEGORY || '-'}</div>
          </div>
          <div className={styles.item}>
            <div>TitleID</div>
            <div>{data?.paramSfo?.TITLE_ID || '-'}</div>
          </div>
          <div className={styles.item}>
            <div>ContentID</div>
            <div>{data?.paramSfo?.CONTENT_ID || '-'}</div>
          </div>
        </div>
      </div>
      <Table
        style={{ marginTop: 8 }}
        size="small"
        border={{ wrapper: true, cell: true }}
        columns={columns}
        data={tableData}
        pagination={false}
      />
    </Drawer>
  );
};
