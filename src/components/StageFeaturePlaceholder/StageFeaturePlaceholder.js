import classNames from 'classnames';
import UpDownIcon from 'components/Icon/UpDownIcon';
import styles from './StageFeaturePlaceholder.module.scss';
import { Droppable } from 'react-drag-and-drop'
import CloudUploadIcon from 'components/Icon/CloudUploadIcon'

const StageFeaturePlaceholder = ({ className, children, onDrop }) => {
  return    <div className={classNames(styles['stage-feature-placeholder'], className, !children ? styles['stage-feature-placeholder-empty'] : null)}>
          <Droppable types={['feature']} onDrop={({feature}) => onDrop(JSON.parse(feature))}>
          {
            children ?
            children :
            <div className={styles['stage-feature-placeholder-content']}>
              <CloudUploadIcon className={styles['stage-feature-placeholder-icon']} />
              <span className={styles['stage-feature-placeholder-name']}>Drag and drop here to add a section</span>
            </div>
          }

          <UpDownIcon className={styles['stage-feature-placeholder-nav']} />
        </Droppable>
      </div>
}

export default StageFeaturePlaceholder;
