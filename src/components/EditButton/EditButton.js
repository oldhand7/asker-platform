import EditField from 'components/Icon/EditFieldIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton';

import styles from './EditButton.module.scss';

const EditButton = ({ className, ...props }) => (
  <IconButton data-test-id="edit-button" className={classNames(styles['trash-button'], className)} Icon={EditField} {...props}/>
)

export default EditButton;
