import classNames from 'classnames';
import { forwardRef} from 'react';

import styles from './IconButton.module.scss';

const IconButton = ({ className, Icon, ...props }, ref) => (
  <button ref={ref} className={classNames(styles['icon-button'], className)} type="button" {...props}>
    <Icon className={styles['icon-button-icon']} />
  </button>
)

export default forwardRef(IconButton);
