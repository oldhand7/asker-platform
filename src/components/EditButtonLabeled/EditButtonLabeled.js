import EditFieldIcon from 'components/Icon/EditFieldIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton';

import styles from './EditButtonLabeled.module.scss';

const EditButton = ({ className, text='', ...props }) => (
  <button data-test-id="edit-button" className={classNames(styles['edit-button-labeled'], className)} type="button" {...props}>
    <EditFieldIcon className={styles['edit-button-labeled-icon']} />
    <span className={styles['edit-button-labeled-text']}>{text}</span>
  </button>
)

export default EditButton;
