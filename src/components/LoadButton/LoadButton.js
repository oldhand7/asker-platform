import PlusIcon from 'components/Icon/PlusIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton'

import styles from './LoadButton.module.scss';

const LoadButton = ({ className, ...props }) => (
  <IconButton data-test-id="load-button" className={classNames(styles['load-button'], className)} Icon={PlusIcon} {...props}  />
)

export default LoadButton;
