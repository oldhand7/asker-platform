import ComparePlusIcon from 'components/Icon/ComparePlusIcon';
import CompareMinusIcon from 'components/Icon/CompareMinusIcon';
import IconButton from 'components/IconButton/IconButton';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './CompareButton.module.scss';

const CompareButton = ({ className, active = true, ...props }, ref) => (
  <IconButton ref={ref} data-test-id="compare-button" className={classNames(
    styles['compare-button'],
    className,
    active ? styles['compare-button-active'] : ''
  )} Icon={active ? CompareMinusIcon : ComparePlusIcon} {...props} />
)

export default forwardRef(CompareButton);
