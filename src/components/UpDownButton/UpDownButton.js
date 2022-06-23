import IconButton from 'components/IconButton/IconButton';
import CarretDownIcon from 'components/Icon/CarretDownIcon';
import CarretUpIcon from 'components/Icon/CarretUpIcon';
import classNames from 'classnames';

import styles from './UpDownButton.module.scss';

const UpDownButton = ({ on = false, className, ...props }) => (
  <IconButton Icon={on ? CarretUpIcon : CarretDownIcon}
  className={classNames(
    styles['up-down-button'],
    className
  )}
  {...props} />
)

export default UpDownButton;
