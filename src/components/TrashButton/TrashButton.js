import TrashIcon from 'components/Icon/TrashIcon';
import IconButton from 'components/IconButton/IconButton';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './TrashButton.module.scss';

const TrashButton = ({ className, ...props }, ref) => (
  <IconButton ref={ref} data-test-id="trash-button" className={classNames(styles['trash-button'], className)} Icon={TrashIcon} {...props} />
)

export default forwardRef(TrashButton);
