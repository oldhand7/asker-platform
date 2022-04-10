import classNames from 'classnames';

import styles from './FeatureDragDropLabel.module.scss';

const FeatureDragDropLabel = ({ className, feature, context = 'menu' }) => {
  return <span className={classNames(styles['feature-drag-drop-label'], className, styles[`feature-drag-drop-label-${feature.type}`])}>
    {feature.title}
  </span>
}

export default FeatureDragDropLabel;
