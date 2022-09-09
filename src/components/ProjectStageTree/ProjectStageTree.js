import classNames from "classnames";
import StageTree from 'components/StageTree/StageTree';
import { getStageKey } from "libs/stage";
import { useCallback, useEffect, useMemo, memo, useState } from "react";
import { useForm } from 'libs/react-hook-form';
import { useFieldArray, useWatch } from 'react-hook-form';

import dynamic from 'next/dynamic';

const DragDropContext = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.DragDropContext;
    }),
  {ssr: false},
);
const Droppable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Droppable;
    }),
  {ssr: false},
);
const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Draggable;
    }),
  {ssr: false},
);


import styles from './ProjectStageTree.module.scss';

const ProjectStageTree = ({ stages = [], stage, onStage, onChange, timetable = {}, errors = {}, className }) => {
    const initValues = useMemo(() => ({ stages }), [])
    
    const {
        control,
        setValue
    }  = useForm({
        values: initValues
    })

    const {
        fields: treeStages,
        ...stagesApi
    } = useFieldArray({
        control,
        name: 'stages',
        keyName: '_id'
    })
       
    const formValues = useWatch({ control, defaultValue: initValues })

    useEffect(() => {
        setValue('stages', stages)
    }, [stages])

    const handleDragEnd = useCallback((result) => {
        const { destination, source } = result;

        if (!destination || destination.index == source.index) {
            return;
        }

        stagesApi.move(source.index, destination.index)
    }, [treeStages, stagesApi])

    const removeHandlers = useMemo(() => {
        const handlers = {};

        for (let i = 0; i < treeStages.length; i++) {
            const stageId = getStageKey(treeStages[i])
            handlers[stageId] = () => stagesApi.remove(i)
        }

        return handlers;
    }, [treeStages, stagesApi])

    const clickHandlers = useMemo(() => {
        const handlers = {};

        for (let i = 0; i < treeStages.length; i++) {
            const stageId = getStageKey(treeStages[i])
            handlers[stageId] = () => onStage(treeStages[i])
        }

        return handlers;
    }, [treeStages, stagesApi, onStage])


    useEffect(() => {
        onChange && onChange(treeStages)
    }, [treeStages, onChange])

    return <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable direction="vertical" droppableId='stage'>{
    (provided) => (
        <ul data-test-id="project-stage-tree" ref={provided.innerRef} {...provided.droppableProps} className={classNames(
            styles['project-stage-tree'],
            className
        )}>
            {treeStages.map((s, index) => {
            const stageId = getStageKey(s);
            const time = timetable[stageId];
            const error = errors && errors[stageId];           

            const key = `${stageId}-${time}-${error && 'err'}`

            return <Draggable key={key} data-test-id={`stage-${index}`} draggableId={stageId} index={index}>{
                    (provided) => (<li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    className={styles['project-stage-tree-item']}>
                <StageTree time={time} stage={s} error={error} onDelete={removeHandlers[stageId]} active={stage && getStageKey(stage) == stageId} onClick={clickHandlers[stageId]}  className={styles['project-stage-tree-item-leaf']}  />
                </li>)}</Draggable>})}
            {provided.placeholder}
    </ul>)}</Droppable></DragDropContext>
}

const ProjectStageTreeMemo = memo(ProjectStageTree, (prev, next) => {
    if (getStageKey(prev.stage) != getStageKey(next.stage)) {
        return false;
    }

    if (JSON.stringify(prev.errors) != JSON.stringify(next.errors)) {
        return false;
    }

    if (JSON.stringify(prev.timetable) != JSON.stringify(next.timetable)) {
        return false;
    }

    return prev.stages.length == next.stages.length;
});

ProjectStageTreeMemo.displayName = 'ProjectStageTree';

export default ProjectStageTreeMemo;