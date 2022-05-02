import FeatureDragDropLabel from 'components/FeatureDragDropLabel/FeatureDragDropLabel';
import classNames from 'classnames';
import FeatureLabel from 'components/FeatureLabel/FeatureLabel';

import styles from './FeatureList.module.scss';

const FeatureList = ({ className, features = [], drag = true, onClick }) => {
  return <ul className={classNames(styles['feature-list'], className)}>
    {features.map((feature, index) => <li className={styles['feature-list-item']} key={index}>
      {
        onClick ?
        <FeatureLabel className={classNames(
          styles['feature-list-option'],
          styles['feature-list-option-clickable'])} feature={feature}  onClick={onClick} /> :
        <FeatureDragDropLabel className={styles['feature-list-option']} feature={feature}  onClick={onClick} />
      }
      </li>
    )}
  </ul>
}

export default FeatureList;
