import classNames from 'classnames';
import { forwardRef} from 'react';

import styles from './IconButton.module.scss';

const IconButton = ({ className, Icon, active = false, ...props }, ref) => (
  <button ref={ref} className={classNames(styles['icon-button'], active ? styles['icon-button-active'] : '', className)} type="button" {...props}>
    <Icon className={styles['icon-button-icon']} />
  </button>
)

export default forwardRef(IconButton);
