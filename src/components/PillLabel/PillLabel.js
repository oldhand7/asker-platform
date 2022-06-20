import classNames from 'classnames';

import styles from './PillLabel.module.scss';

const PillLabel = ({ className, text = '', children, color = 'inherit', wrap = false }) => (
  <div data-test-id="pill-label" style={{color}} className={classNames(styles['pill-label'], className)}>
    <span style={{ whiteSpace: wrap ? 'inherit' : 'nowrap'}} className={styles['pill-label-text']}>{children ? children : text}</span>
  </div>
)

export default PillLabel;
