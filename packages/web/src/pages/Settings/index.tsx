import { Button, Switch } from '@arco-design/web-react';

import { Divider } from '@/components/Divider';
import { useContainer } from '@/store/container';

import { Info } from './components/Info';
import { SettingItem } from './components/SettingItem';

export const Settings = () => {
  const { settings, chnageSettings } = useContainer();

  return (
    <div>
      <Info />
      <Divider />
      <SettingItem title="Display logo" desc="Show app logo in side nav bar.">
        <Switch checked={settings.displayLogo} onChange={value => chnageSettings({ displayLogo: value })} />
      </SettingItem>
      <SettingItem
        title="Force WebDAV download link to http"
        desc="Before sending the installation task to PS4 force the WebDAV download link to http."
      >
        <Switch
          checked={settings.forceWebDavDownloadLinkToHttp}
          onChange={value => chnageSettings({ forceWebDavDownloadLinkToHttp: value })}
        />
      </SettingItem>
      <SettingItem title="Display pkg raw title" desc="Whether show pkg raw title, default is file path base name">
        <Switch
          checked={settings.displayPkgRawTitle}
          onChange={value => chnageSettings({ displayPkgRawTitle: value })}
        />
      </SettingItem>
      {window.electron && (
        <SettingItem
          title="Dev tools"
          desc="When sending an issue, you should open the dev tools, carrying information on the console, network, etc."
        >
          <Button
            onClick={() => {
              window.electron?.openDevTools();
            }}
          >
            Open
          </Button>
        </SettingItem>
      )}
      {window.electron && (
        <SettingItem
          title="App log"
          desc="When sending an issue, you should open the log and carry the relevant information."
        >
          <Button
            onClick={() => {
              window.electron?.openAppLog();
            }}
          >
            Open
          </Button>
        </SettingItem>
      )}
    </div>
  );
};
