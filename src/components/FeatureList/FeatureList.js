import FeatureDragDropLabel from 'components/FeatureDragDropLabel/FeatureDragDropLabel';
import classNames from 'classnames';

import styles from './FeatureList.module.scss';

const FeatureList = ({ className, features = [] }) => {
  return <ul className={classNames(styles['feature-list'], className)}>
    {features.map((feature, index) => <li className={styles['feature-list-item']} key={index}>
        <FeatureDragDropLabel className={styles['feature-list-option']} feature={feature} />
      </li>
    )}
  </ul>
}

export default FeatureList;
