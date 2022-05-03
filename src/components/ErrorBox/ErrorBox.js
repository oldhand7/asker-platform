import classNames from 'classnames';

import styles from './ErrorBox.module.scss';

const ErrorBox = ({ className, children }) => {
    return <div className={classNames(styles['error-box'], className)}>
      {children}
    </div>
}

export default ErrorBox;
