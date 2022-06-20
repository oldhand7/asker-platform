import classNames from 'classnames';
import { useMemo } from 'react';

import styles from './CriteriaRating.module.scss';

const CriteriaRating = ({ className, value = 0, maxValue=4, color = '#CCC'}) => {

  const left = useMemo(
    () => Math.round((value-1) * 100 / maxValue),
    [maxValue, value]
  );

  return <div data-test-id='criteria-rating' style={{color}} className={classNames(styles['criteria-rating'], className)}>
    <span className={styles['criteria-rating-value']} style={{left: `${left}%`}}>{value}</span>
  </div>
}

export default CriteriaRating;
