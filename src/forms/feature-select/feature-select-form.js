import { features, featureTypes } from 'libs/features';
import classNames from 'classnames';
import FeatureList from 'components/FeatureList/FeatureList';
import { useTranslation } from 'libs/translation';

import styles from './feature-select-form.module.scss';

const FeatureSelectForm = ({ className, onValues }) => {
  const { t } = useTranslation();

  return <div className={classNames(styles['feature-select-form'], className)}>
    <h2 className={styles['feature-select-form-title']}>{t('actions.click-label')}</h2>

    <div className={styles['feature-select-form-field']}>
      {featureTypes.map((featureType) => {
        const targetFeatures = features.filter(f => f.type == featureType.id)

        if (targetFeatures.length == 0) {
          return null;
        }

        return <div key={`feature-list-widget-${featureType.id}`} className={styles['feature-select-form-widget']}>
          <h3 className={styles['feature-select-form-widget-title']}>{featureType.name}</h3>
          <FeatureList className={styles['feature-select-form-widget-body']} features={targetFeatures} onClick={onValues} context='popup' />
        </div>
      })}
    </div>
  </div>
}

export default FeatureSelectForm;
