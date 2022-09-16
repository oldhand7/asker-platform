const { default: classNames } = require("classnames");
const { default: StageTreeLeaf } = require("components/StageTreeLeaf/StageTreeLeaf");
const { useTranslation } = require("libs/translation");
const { useCallback, useMemo, useState, memo, useEffect } = require("react");
import { features } from "libs/features";
import DragIcon from "components/Icon/DragIcon";
import QuestionIcon from "components/Icon/QuestionIcon";
import TrashIcon from "components/Icon/TrashIcon";

import styles from './StageTree.module.scss';

const StageTree = ({ className, stage, time, error, active = false, draggable=true, onClick, onDelete, dragProps = {}, drag = false, treeState = {}, onTreeState, config }) => {
    const { i18nField } = useTranslation();
    const { t } = useTranslation();
    
    const questions = useMemo(() => {
        return config && config.questions || [];
    }, [config])

    const actions = useMemo(() => ([
        { id: 'delete', icon: TrashIcon, name: t('actions.delete') }
    ]), [])

    const handleAction = useCallback((a) => {
        if (a.id == 'delete' && onDelete) {
            onDelete();
        }
    }, [onDelete])

    const feature = useMemo(() => stage && features.find(f => f.id == stage.id), [stage])

    const criterias = useMemo(() => {
        if (!feature || !feature.criteria || !questions.length) {
            return []
        }

        const criteriaMap = {}

        for (let i = 0; i < questions.length; i++) {
            const { criteria } = questions[i];

            if (!criteria) {
                continue;
            }

            if (criteriaMap[criteria.id]) {
                criteriaMap[criteria.id].questions.push(questions[i])
            } else {
                criteriaMap[criteria.id] = {
                    criteria,
                    questions: [questions[i]]
                }
            }
        }

        const criterias = Object.values(criteriaMap);

        criterias.sort((a, b) => {
            const { criteria: criteriaA, questions: questionsA } = a;
            const { criteria: criteriaB, questions: questionsB } = b;

            if (questionsA.length > questionsA.length) return -1;
            if (questionsA.length < questionsB.length) return 1;

            const nameA = i18nField(criteriaA.name)
            const nameB = i18nField(criteriaB.name)

            if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;
            if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;

            return 0;
        })

        return criterias;
    }, [questions, feature])

    const stageLabel = useMemo(() => {
        const name = feature && i18nField(feature.name) || '???';

        if (criterias.length) {
            return `${name} (${criterias.length})`
        }

        if (questions.length) {
            return `${name} (${questions.length})`
        }

        return name;
    }, [feature, criterias, questions])

    const handleRootClick = useCallback((ev) => {
        if (!active && treeState.root) {
            onClick && onClick(ev)

            return;
        }

        const openState = {
            ...treeState,
            'root': !treeState.root
        }
        
        onTreeState && onTreeState(openState)
        onClick && onClick(ev)
    }, [onTreeState, treeState, onClick, active])

    const toggleCriteria = useCallback((criteria) => {
        onTreeState({
            ...treeState,
            [criteria.id]: !treeState[criteria.id]
        })
    }, [treeState, onTreeState])

    return <ul {...dragProps} className={classNames(
        styles['stage-tree'],
        className
    )}>
        <li data-level="1" className={styles['stage-tree-item']}> 
            <StageTreeLeaf drag={drag} draggable={draggable} active={active} error={error} onClick={handleRootClick} expanded={treeState['root']} level={1} hasChildren={criterias.length || questions.length} Icon={DragIcon} time={time} label={stageLabel} actions={actions} onAction={handleAction} />
            {
                criterias.length && treeState['root'] ?
                <ul className={styles['stage-tree']}>
                    {criterias.map(({ criteria, questions }) => (
                        <li data-level="2" className={styles['stage-tree-item']} key={criteria.id}>
                            <StageTreeLeaf draggable={false} onClick={() => toggleCriteria(criteria)} expanded={treeState[criteria.id]} hasChildren={true} level={2} label={`${i18nField(criteria.name)} (${questions.length})`} />
            
                            {treeState[criteria.id] ?
                            <ul  className={styles['stage-tree']}>
                                {questions.map(question => {
                                    const questionName = i18nField(question.name);

                                    return <li data-level="3" key={question.id} className={styles['stage-tree-item']}>
                                        <StageTreeLeaf hoverText={questionName} level={3} Icon={QuestionIcon} label={questionName} />
                                    </li>
                                })}
                            </ul> : null}
                        </li>
                    ))}
                </ul> : null
            }

            {
                !criterias.length && questions.length && treeState['root'] ?
                <ul className={styles['stage-tree']}>
                    {questions.map((question) => (
                       <li data-level="2"
                            className={styles['stage-tree-item']} key={question.id} >
                            <StageTreeLeaf draggable={true} expanded={true} level={2} Icon={QuestionIcon} label={i18nField(question.name)} />
                        </li>
                    ))}
                </ul> : null
            }
        </li>
    </ul>
}

export default memo(StageTree);