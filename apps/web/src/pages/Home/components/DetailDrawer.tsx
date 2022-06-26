import { Button, Drawer, Table, Tabs } from '@arco-design/web-react';
import { IconSend } from '@arco-design/web-react/icon';
import { PkgListClickAction } from 'common/types/configStore';
import { useState } from 'react';

import { FileStat } from '@/types';
import { formatPkgName } from '@/utils';

import { BasicInfo } from './BasicInfo';
import styles from './DetailDrawer.module.less';
import { SimpleList } from './SimpleList';

type Props = {
  visible: boolean;
  data?: FileStat;
  displayPkgRawTitle?: boolean;
  handleCancel: () => void;
  handleInstallByActionType: (data: FileStat, clickAction: PkgListClickAction) => void;
};

const { TabPane } = Tabs;

enum ActiveTabKey {
  INFO = 'INFO',
  PATCH = 'PATCH',
  ADDON = 'ADDON'
}

export const DetailDrawer = ({ visible, data, displayPkgRawTitle, handleCancel, handleInstallByActionType }: Props) => {
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

  const [activeTabKey, setActiveTabKey] = useState<ActiveTabKey>(ActiveTabKey.INFO);

  return (
    <Drawer
      className={styles.wrapper}
      visible={visible}
      onCancel={() => {
        setActiveTabKey(ActiveTabKey.INFO);
        handleCancel();
      }}
      title={formatPkgName(data, displayPkgRawTitle)}
      width={500}
      footer={
        <Button
          icon={<IconSend />}
          type="primary"
          onClick={() => {
            data && handleInstallByActionType(data, PkgListClickAction.install);
          }}
        >
          Send install task
        </Button>
      }
    >
      <BasicInfo data={data} />
      <Tabs
        size="small"
        activeTab={activeTabKey}
        onChange={key => setActiveTabKey(key as ActiveTabKey)}
        style={{
          marginTop: 20
        }}
        type="line"
      >
        <TabPane key={ActiveTabKey.INFO} title={ActiveTabKey.INFO}>
          <Table size="small" border={false} columns={columns} data={tableData} pagination={false} />
        </TabPane>
        {data?.patchs?.length && (
          <TabPane
            key={ActiveTabKey.PATCH}
            title={
              <span>
                {ActiveTabKey.PATCH} ({data.patchs.length})
              </span>
            }
          >
            <SimpleList data={data?.patchs} handleInstallByActionType={handleInstallByActionType} />
          </TabPane>
        )}
        {data?.addons?.length && (
          <TabPane
            key={ActiveTabKey.ADDON}
            title={
              <span>
                {ActiveTabKey.ADDON} ({data.addons.length})
              </span>
            }
          >
            <SimpleList data={data?.addons} handleInstallByActionType={handleInstallByActionType} />
          </TabPane>
        )}
      </Tabs>
    </Drawer>
  );
};
