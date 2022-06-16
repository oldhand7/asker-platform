import classNames from 'classnames';

import styles from './IconButton.module.scss';

const IconButton = ({ className, Icon, ...props }) => (
  <button data-test-id={props['data-test-id']} className={classNames(styles['icon-button'], className)} type="button" {...props}>
    <Icon className={styles['icon-button-icon']} />
  </button>
)

export default IconButton;
