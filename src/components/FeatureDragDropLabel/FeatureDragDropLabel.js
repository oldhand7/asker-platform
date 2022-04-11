import classNames from 'classnames';

import styles from './FeatureDragDropLabel.module.scss';

const FeatureDragDropLabel = ({ index = 0, onClick, className, feature, context = 'menu' }) => {

  return <span onClick={onClick} className={classNames(styles['feature-drag-drop-label'], className, styles[`feature-drag-drop-label-${feature.type}`], styles[`feature-drag-drop-label-${context}`])}>
    {feature.name}
</span>
}

export default FeatureDragDropLabel;
