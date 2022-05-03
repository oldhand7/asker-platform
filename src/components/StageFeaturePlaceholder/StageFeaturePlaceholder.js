import classNames from 'classnames';
import UpDownIcon from 'components/Icon/UpDownIcon';
import styles from './StageFeaturePlaceholder.module.scss';
import { Droppable } from 'react-drag-and-drop'

const StageFeaturePlaceholder = ({ className, children, onDrop }) => {
  return    <div className={classNames(styles['stage-feature-placeholder'], className, !children ? styles['stage-feature-placeholder-empty'] : null)}>
          <Droppable types={['feature']} onDrop={({feature}) => onDrop(JSON.parse(feature))}>
          {
            children ?
            children :
            <>
            <span className={styles['stage-feature-placeholder-name']}>Drag and drop here to add a section</span>
            </>
          }

          <UpDownIcon className={styles['stage-feature-placeholder-nav']} />
        </Droppable>
      </div>
}

export default StageFeaturePlaceholder;
