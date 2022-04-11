import classNames from 'classnames';
import TrashIcon from 'components/Icon/TrashIcon';
import UpDownIcon from 'components/Icon/UpDownIcon';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FeatureDragDropLabel from 'components/FeatureDragDropLabel/FeatureDragDropLabel';
import { useEffect, useState } from 'react';

import styles from './ProjectFormStager.module.scss';

const FeaturePlaceholder = ({ className, children }) => (
  <div className={classNames(styles['project-form-stager-placeholder'], !children ? styles['project-form-stager-placeholder-empty'] : null)}>
    {
      children ?
      children :
      <>
        <span className={styles['project-form-stager-placeholder-name']}>Drag and drop here to add a section</span>
      </>
    }

    <UpDownIcon className={styles['project-form-stager-placeholder-nav']} />
  </div>
)

const ProjectFormStager = ({ className, onStages, stages = [], activeStage = null, onStageSelect, onStageDelete }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(process.browser);
  }, [])


  const handleStageNav = (dir, stage) => {
    alert('Moving stage ' + dir)
  }

  const handleStageDelete = (stage, ev) => {
    ev.stopPropagation();

    if (confirm('Are you sure?') && onStages) {
      onStages([
        ...stages.map(s => (s != stage) ? s : null)
      ])
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    const newStages = [
      ...stages
    ]

    newStages.splice(source.index, 1)
    newStages.splice(
      destination.index,
      0,
      draggableId.indexOf('null') === 0 ? null : stages.find(s => s && s.id == draggableId)
    )

    onStages(newStages)
  }

  return isBrowser ? <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId='stager'>
    {(provided) => (
    <ul ref={provided.innerRef} {...provided.droppableProps} className={classNames(styles['project-form-stager'], className)}>
    {stages.map((stage, index) => (
      <Draggable key={stage ? stage.id : `null-${index}`}  data-test-id={`stage-${index}`} draggableId={stage ? stage.id : `null-${index}`} index={index}>
        {(provided) => (
          <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
           >
            <h6 className={styles['project-form-stager-item-title']}>Stage {index + 1}</h6>

            <div className={styles['project-form-stager-item-body']}>
              <FeaturePlaceholder>
                {stage ? <FeatureDragDropLabel onClick={() => onStageSelect(stage)} className={styles['project-form-stager-feature']} feature={stage} context='stager' /> : null}
              </FeaturePlaceholder>

              <div className={styles['project-form-stager-item-control']}>
                <button type="button" onClick={(ev) => handleStageDelete(stage, ev)} className={styles['project-form-stager-item-control-button']}>
                  <TrashIcon className={styles['project-form-stager-item-control-button-icon']} />
                </button>
              </div>
            </div>
          </li>
        )}
        </Draggable>
      ))}
      {provided.placeholder}
    </ul>)}</Droppable>
    </DragDropContext> : null
}

export default ProjectFormStager;
