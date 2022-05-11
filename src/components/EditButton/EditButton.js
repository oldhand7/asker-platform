import PencilIcon from 'components/Icon/PencilIcon';
import classNames from 'classnames';

import styles from './EditButton.module.scss';

const EditButton = ({ className, text = '', ...props }) => (
  <button data-test-id="edit-button" className={classNames(styles['edit-button'], className)} type="button" {...props}>
    <PencilIcon className={styles['edit-button-icon']} /> {text}
  </button>
)

export default EditButton;
