
import Button from './Button';
import classNames from 'classnames';

import styles from './Button.module.scss';

const FilterButton = ({ children, theme = 'green', color, active = false, className, ...props }) => {
  return <Button data-state={active ? 'on' : 'off'} style={color ? { textColor: color } : {}}  {...props} className={classNames([
    styles['button-filter'],
    active ? styles['button-filter-active'] : '',
    styles[`button-filter-${theme}`],
    className
  ])}><span className={styles['button-filter-inner']}>{children}</span></Button>
}

export default FilterButton;
