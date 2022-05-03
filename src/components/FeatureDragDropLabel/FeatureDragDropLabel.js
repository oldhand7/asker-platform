import { Draggable } from 'react-drag-and-drop'
import FeatureLabel from 'components/FeatureLabel/FeatureLabel';

const FeatureDragDropLabel = ({ onClick, className, feature }) => {
  return <Draggable
    type="feature"
    data={JSON.stringify(feature)}>
    <FeatureLabel onClick={onClick} className={className} feature={feature} />
</Draggable>
}

export default FeatureDragDropLabel;
