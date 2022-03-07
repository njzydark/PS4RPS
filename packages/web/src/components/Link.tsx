import { Link as ArcoLink, LinkProps as ArcoLinkProps } from '@arco-design/web-react';
import cs from 'classnames';

import styles from './Link.module.less';

type LinkProps = ArcoLinkProps & {
  canceldUnderline?: boolean;
};

export const Link = (props: LinkProps) => {
  return (
    <ArcoLink
      {...props}
      href="javascript:;"
      className={cs(styles.link, props.canceldUnderline && styles.cancelUnderline, props.className)}
    >
      {props.children}
    </ArcoLink>
  );
};
