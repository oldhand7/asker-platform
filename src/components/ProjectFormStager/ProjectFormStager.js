import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FeatureDragDropLabel from 'components/FeatureDragDropLabel/FeatureDragDropLabel';
import { useEffect, useState } from 'react';
import StageFeaturePlaceholder from 'components/StageFeaturePlaceholder/StageFeaturePlaceholder'
import TrashButton from 'components/TrashButton/TrashButton'
import { useModal } from 'libs/modal';
import FeatureSelectModal from 'modals/feature-select/feature-select-modal';
import LoadButton from 'components/LoadButton/LoadButton';
import MinutesInput from 'components/MinutesInput/MinutesInput';
import { getStageTime } from 'libs/stage'

import styles from './ProjectFormStager.module.scss';

const ProjectFormStager = ({ className, onStages, stages = [], activeStage = null, onStageSelect }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const openFeatureSelectorModal = useModal(FeatureSelectModal, { size: 'small'});

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
    } else if (onStages) {
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
    if (!feature) {
      return;
    }

    const stagesCopy = [
      ...stages
    ]

    if (stagesCopy[index] && !confirm('Are you sure?')) {
      return;
    }

    stagesCopy[index] = feature;

    onStages(stagesCopy, feature)

    return;
  }

  const handleStageTime = (index, time) => {
    stages[index].time = Number.parseInt(time) || 1;

    onStages([
      ...stages
    ])
  }

  return isBrowser ? <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId='stager'>
    {(provided) => (
    <ul data-test-id="stager" ref={provided.innerRef} {...provided.droppableProps} className={classNames(styles['project-form-stager'], className)}>
    {stages.map((stage, index) => (
      <Draggable key={stage ? `${stage.id}-${index}` : `null-${index}`}  data-test-id={`stage-${index}`} draggableId={stage ? stage.id : `null-${index}`} index={index}>
        {(provided) => (
          <li
          data-test-id={`stage-${index+1}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={classNames(
            styles['project-form-stager-item'],
            activeStage && activeStage == stage ? styles['project-form-stager-item-active'] : ''
          )}
           >
            <h6 className={styles['project-form-stager-item-title']}>Stage {index + 1}</h6>

            <div className={styles['project-form-stager-item-body']}>
              <StageFeaturePlaceholder onDrop={(item) => handleFeatureDrop(item, index, stage)} className={styles['project-form-stager-item-placeholder']}>
                {stage ? <FeatureDragDropLabel onClick={() => onStageSelect(stage)} className={styles['project-form-stager-item-feature']} feature={stage} context='stager' /> : null}
              </StageFeaturePlaceholder>
              <div className={classNames(styles['project-form-stager-item-control'], styles['project-form-stager-item-control-actions'])}>
                <LoadButton onClick={(ev) => openFeatureSelectorModal(item => handleFeatureDrop(item, index, stage))}  />
                <TrashButton onClick={(ev) => handleStageDelete(stage, index, ev)}  />

                {index == 0 ? <div className={styles['project-form-stager-item-control-info']}>
                  <span>Actions</span>
                </div>   : null}
              </div>
              {stage ?
              <div className={styles['project-form-stager-item-control']}>
                <MinutesInput value={getStageTime(stage)} onChange={v => handleStageTime(index, v)} />
                {index == 0 ? <div className={styles['project-form-stager-item-control-info']}>
                  <span>Time edit</span>
                </div>   : null}
              </div> : null}
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
