import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FeatureDragDropLabel from 'components/FeatureDragDropLabel/FeatureDragDropLabel';
import { useEffect, useState } from 'react';
import StageFeaturePlaceholder from 'components/StageFeaturePlaceholder/StageFeaturePlaceholder'
import TrashButton from 'components/TrashButton/TrashButton'

import styles from './ProjectFormStager.module.scss';

const ProjectFormStager = ({ className, onStages, stages = [], activeStage = null, onStageSelect, onStageDelete }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(process.browser);
  }, [])

  const handleStageDelete = (stage, index, ev) => {
    ev.stopPropagation();

    if (!stage) {
      onStages([
        ...stages.slice(0, index),
        ...stages.slice(index + 1)
      ])
    } else if (confirm('Are you sure?') && onStages) {
      onStages([
        ...stages.map(s => (s != stage) ? s : null)
      ])
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.index == source.index) {
      return;
    }

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

  const handleFeatureDrop = (feature = null, index) => {
    const stagesCopy = [
      ...stages
    ]

    stagesCopy[index] = feature;

    onStages(stagesCopy)

    return;
  }

  return isBrowser ? <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId='stager'>
    {(provided) => (
    <ul ref={provided.innerRef} {...provided.droppableProps} className={classNames(styles['project-form-stager'], className)}>
    {stages.map((stage, index) => (
      <Draggable key={stage ? `${stage.id}-${index}` : `null-${index}`}  data-test-id={`stage-${index}`} draggableId={stage ? stage.id : `null-${index}`} index={index}>
        {(provided) => (
          <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={classNames(
            styles['project-form-stager-item'],
            stage && activeStage == stage ? styles['project-form-stager-item-active'] : ''
          )}
           >
            <h6 className={styles['project-form-stager-item-title']}>Stage {index + 1}</h6>

            <div className={styles['project-form-stager-item-body']}>
              <StageFeaturePlaceholder onDrop={(item) => handleFeatureDrop(item, index)} className={styles['project-form-stager-item-placeholder']}>
                {stage ? <FeatureDragDropLabel onClick={() => onStageSelect(stage)} className={styles['project-form-stager-item-feature']} feature={stage} context='stager' /> : null}
              </StageFeaturePlaceholder>
              <div className={styles['project-form-stager-item-control']}>
                <TrashButton onClick={(ev) => handleStageDelete(stage, index, ev)} className={styles['project-form-stager-item-control-button']} />
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
