import TrashIcon from 'components/Icon/TrashIcon';
import classNames from 'classnames';

import styles from './TrashButton.module.scss';

const TrashButton = ({ className, ...props }) => (
  <button data-test-id="trash-button" className={classNames(styles['trash-button'], className)} type="button" {...props}>
    <TrashIcon className={styles['trash-button-icon']} />
  </button>
)

export default TrashButton;
