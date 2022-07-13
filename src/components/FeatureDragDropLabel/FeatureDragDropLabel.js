import { Draggable } from 'react-drag-and-drop'
import FeatureLabel from 'components/FeatureLabel/FeatureLabel';
import { useState } from 'react';
import ReactDOM from 'react-dom'

import styles from './FeatureDragDropLabel.module.scss';

const FeatureDragDropLabel = ({ onClick, className, feature, context = '' }) => {
  const [dragEl, setDragEl] = useState(null);

  const handleDragStart = (e) => {
    const dragFeature = <FeatureLabel
      feature={feature}
      context={'drag'} />

    const container = document.createElement('div');

    container.setAttribute('id', 'drag-label-container')
    container.classList.add(styles['feature-drag-label-drag-container'])

    ReactDOM.render(
      <FeatureLabel
        feature={feature}
        context={'drag'} />,
      container
    )

    document.body.appendChild(container)

    e.dataTransfer.setDragImage(container, 0, 0);

    setDragEl(container)
  }

  const handleDragEnd = () => {
    if (dragEl) {
      dragEl.remove()
    }
  }

  return <Draggable
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    type="feature"
    data={JSON.stringify(feature)}>
    <FeatureLabel onClick={onClick} className={className} feature={feature} context={context} />
</Draggable>
}

export default FeatureDragDropLabel;
