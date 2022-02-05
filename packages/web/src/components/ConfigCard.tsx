import cs from 'classnames';
import { ReactNode } from 'react';

import styles from './ConfigCard.module.less';

type Props = {
  title: string;
  isActive?: boolean;
  action?: ReactNode;
  onClick?: () => void;
};

const ActionIcon = (props: { children: ReactNode }) => {
  return <div className={styles['action-icon-wrapper']}>{props.children}</div>;
};

export const ConfigCard = ({ title, action, isActive, onClick }: Props) => {
  return (
    <div
      className={cs(styles.wrapper, isActive && styles.active)}
      onClick={() => {
        onClick?.();
      }}
    >
      <div className={styles.content}>{title}</div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

ConfigCard.ActionIcon = ActionIcon;
