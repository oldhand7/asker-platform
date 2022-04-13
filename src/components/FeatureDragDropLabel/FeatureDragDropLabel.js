import classNames from 'classnames';
import { Draggable } from 'react-drag-and-drop'

import styles from './FeatureDragDropLabel.module.scss';

const FeatureDragDropLabel = ({ index = 0, onClick, className, feature, context = 'menu' }) => {
  return <Draggable type="feature" data={JSON.stringify(feature)}><span data-test-id={`feature-${feature.id}`} onClick={onClick} className={classNames(styles['feature-drag-drop-label'], className, styles[`feature-drag-drop-label-${feature.type}`], styles[`feature-drag-drop-label-${context}`])}>
    {feature.name}
</span></Draggable>
}

export default FeatureDragDropLabel;
