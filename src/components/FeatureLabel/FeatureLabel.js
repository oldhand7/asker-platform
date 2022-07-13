import classNames from 'classnames';
import DragIcon from 'components/Icon/DragIcon';
import { useEffect, useRef } from 'react';

import styles from './FeatureLabel.module.scss';

const FeatureLabel = ({ index = 0, onClick, className, feature, context = '', drag = false }) => {


  return <span
    data-test-id={`feature-${feature.id}`}
    onClick={() => onClick && onClick(feature)}
    className={classNames(
      styles['feature-label'],
      className,
      styles[`feature-label-${context}`],
      styles[`feature-label-${feature.type}`],
      drag ? styles[`feature-label-drag`] : ''
    )}>
    <span className={styles['feature-label-name']}>{feature.name}</span>
    {context != 'stager' && context != 'popup' ? <DragIcon className={styles['feature-label-icon']} /> : null}
    </span>
}

export default FeatureLabel;
