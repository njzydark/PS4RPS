import { Radio } from '@arco-design/web-react';
import { IconMoon, IconSun } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { useDarkMode } from '@/hooks/useDarkMode';

type CheckedKey = 'light' | 'dark' | 'auto';

export const ToggleDarkMode = () => {
  const { auto, isDarkMode, setAuto, setIsDarkMode } = useDarkMode();

  const [checked, setChecked] = useState<CheckedKey>(() => {
    return auto ? 'auto' : isDarkMode ? 'dark' : 'light';
  });

  const handleChange = (value: CheckedKey) => {
    setChecked(value);
    if (value === 'auto') {
      setAuto(true);
    } else {
      setAuto(false);
      setIsDarkMode(value === 'dark');
    }
  };

  return (
    <Radio.Group type="button" value={checked} onChange={handleChange}>
      <Radio value="light">
        <IconSun />
      </Radio>
      <Radio value="auto">Auto</Radio>
      <Radio value="dark">
        <IconMoon />
      </Radio>
    </Radio.Group>
  );
};
