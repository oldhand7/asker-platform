import classNames from 'classnames';

import styles from './Button1.module.scss';

const ThemedButton = ({ className, children, text = '', theme = 'grey', ...props}) => (
    <button data-theme={theme} className={classNames(
        styles['button-themed'],
        className,
        styles[`button-themed-${theme}`]
    )} {...props}>{children || text}</button>
)

export default ThemedButton;