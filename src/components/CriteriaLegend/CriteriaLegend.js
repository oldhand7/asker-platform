import ProgressBar from 'components/ProgressBar/ProgressBar';
import { COLOR_MAP } from 'libs/config';
import { useState } from 'react';
import classNames from 'classnames';
import { fixFloat } from 'libs/helper';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

import styles from './CriteriaLegend.module.scss';

const CriteriaLegend = ({ criteria, className }) => {
  const [active, setActive] = useState(true);
  const { i18nField } = useTranslation();
  const { locale } = useRouter();

  const toggleOpen = () => criteria.children && setActive(!active)

  return <div data-test-id="criteria-legend" onClick={toggleOpen} key={criteria.type} style={{ color: COLOR_MAP[criteria.type] || '#CCC' }} className={classNames(
    styles['criteria-legend'],
    className,
    active ? styles['criteria-legend-active'] : '',
    criteria.children ? styles['criteria-legend-has-children'] : ''
  )}>
    <div className={styles['criteria-legend-label']}>
      <span className={styles['criteria-legend-label-name']}>{i18nField(criteria.name)}</span>
      <span className={styles['criteria-legend-label-value']}>
        <span className={styles['criteria-legend-label-value-inner']}>{fixFloat(criteria.weight, 1)}%</span>
      </span>
    </div>

    {criteria.children ? <ul style={!active ? { display: 'none' } : {}} className={styles['criteria-legend-details']}>
      {criteria.children.map(c => (
        <li key={`${locale}-${criteria.type}-${c.type}`} className={styles['criteria-legend-details-item']}>
          <span className={styles['criteria-legend-details-item-name']}>{i18nField(c.name)}</span>
          <span className={styles['criteria-legend-details-item-value']}>
            <span>{fixFloat(c.weight, 1)}%</span>
          </span>
        </li>
      ))}
    </ul> : null}

    <ProgressBar className={styles['criteria-legend-progress']} p={criteria.weight} color={COLOR_MAP[criteria.type]} />
  </div>
}

export default CriteriaLegend;
