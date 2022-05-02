import SelectIcon from 'components/Icon/SelectIcon';
import classNames from 'classnames';

import styles from './LoadButton.module.scss';

const LoadButton = ({ className, ...props }) => (
  <button data-test-id="load-button" className={classNames(styles['load-button'], className)} type="button" {...props}>
    <SelectIcon className={styles['load-button-icon']} />
  </button>
)

export default LoadButton;
