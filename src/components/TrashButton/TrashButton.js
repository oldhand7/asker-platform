import TrashIcon from 'components/Icon/TrashIcon';
import IconButton from 'components/IconButton/IconButton';
import classNames from 'classnames';

import styles from './TrashButton.module.scss';

const TrashButton = ({ className, ...props }) => (
  <IconButton data-test-id="trash-button" className={classNames(styles['trash-button'], className)} Icon={TrashIcon} {...props} />
)

export default TrashButton;
