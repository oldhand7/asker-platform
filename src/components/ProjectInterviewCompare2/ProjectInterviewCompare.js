import classNames from 'classnames';
import { scoreMap } from 'libs/scoring';
import { useEffect, useState, useLayoutEffect } from 'react';
import { getStageKey } from 'libs/stage'
import CandidateCompareColumn from 'components/CandidateCompareColumn/CandidateCompareColumn';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowSharpLeftIcon from 'components/Icon/ArrowSharpLeftIcon';
import ArrowSharpRightIcon from 'components/Icon/ArrowSharpRightIcon';

import style from './ProjectInterviewCompare.module.scss';

const labels = {
    'screening-questions': 'Screening',
    'other-questions': 'Other',
    'competency': 'Competencies',
    'screening': 'Screening',
    'hard-skill': 'Hard-skill',
    'motivation': 'Motivation',
    'culture-fit': 'Culture-fit',
    'experience': 'Experience'
}

const ProjectInterviewCompare = ({ className, compare = [], project, onCompareAdd, onCompareRemove, onCompare }) => {
    const [details, setDetails] = useState([]);
    const [activeRows, setActiveRows] = useState({});
    const [heights, setHeights] = useState({});
    const [offset, setOffset] = useState(0);
    const [_compare, setCompare] = useState(compare);

    useLayoutEffect(() => {
        const details = []

        const adjustedCompare = compare.map(c => {
            c.scoreMap = scoreMap(c, project)

            const otherQuestions = {
                'screening-questions': [],
                'other-questions': []
            };
        
            for (let i = 0; i < project.stages.length; i++) {
              if (['screening-questions', 'other-questions'].indexOf(project.stages[i].id) == -1) {
                continue;
              }
        
              const key = getStageKey(project.stages[i])
        
              if (c.evaluations && c.evaluations[key]) {
        
                for (const qid in c.evaluations[key]) {
                  const { config } = project.stages[i];
        
                  const question = config.questions.find(q => q.id == qid)
        
                  if (question) {
                    otherQuestions[project.stages[i].id].push({
                      question: question,
                      answer: c.evaluations[key][qid]
                    })
                  }
                }
              }
            }

            c.otherQuestions = otherQuestions;

            return c;
        })

        if (adjustedCompare.some(c => c.scoreMap['competency'].score)) {
            details.push({
                type: 'competency',
                evaluations: adjustedCompare.map(c => c.scoreMap['competency'])
            })
        }

        if (adjustedCompare.some(c => c.otherQuestions['screening-questions'].length)) {
            details.push({
                type: 'screening-questions',
                evaluations: adjustedCompare.map(c => c.otherQuestions['screening-questions'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['hard-skill'].score)) {
            details.push({
                type: 'hard-skill',
                evaluations: adjustedCompare.map(c => c.scoreMap['hard-skill'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['motivation'].score)) {
            details.push({
                type: 'motivation',
                evaluations: adjustedCompare.map(c => c.scoreMap['motivation'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['culture-fit'].score)) {
            details.push({
                type: 'culture-fit',
                evaluations: adjustedCompare.map(c => c.scoreMap['culture-fit'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['experience'].score)) {
            details.push({
                type: 'experience',
                evaluations: adjustedCompare.map(c => c.scoreMap['experience'])
            })
        }
        
        if (adjustedCompare.some(c => c.otherQuestions['other-questions'].length)) {
            details.push({
                type: 'other-questions',
                evaluations: adjustedCompare.map(c => c.otherQuestions['other-questions'])
            })
        }

        setDetails(details)
        setCompare(compare);
        setOffset(0)
    }, [compare, project])

    const handleRowToggle = type => {
        setActiveRows({
            ...activeRows,
            [type]: !activeRows[type]
        })
    }

    const handleColumnHeights = _heights => {
        const newHeights = {}

        for (let key in _heights) {
            newHeights[key] = Math.max(_heights[key], 0)
        }

        setHeights(newHeights)
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || destination.index == source.index) {
        return;
        }

        const newCompare = [
            ...compare
        ]

        newCompare.splice(source.index, 1)
        newCompare.splice(
            destination.index,
            0,
            compare.find(c => c && c.id == draggableId)
        )

        onCompare(newCompare)
    }

    useEffect(() => {
        const el = document.querySelector(`#candidate-compare-column-${offset}`);

        if (el) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest'})
        }
    }, [offset, _compare])
    
    return <div data-test-id="project-interview-compare" className={classNames(
        style['project-interview-compare'],
        _compare.length - offset > 4 ? style['project-interview-compare-has-children-right'] : '',
        offset > 0 ? style['project-interview-compare-has-children-left'] : '',
        className
    )}> 
        <div className={style['project-interview-compare-sidebar']}>
            <div className={style['project-interview-compare-sidebar-head']}>
                <button onClick={onCompareAdd} className={style['project-interview-compare-add-candidate']}>+ Add candidate</button>
            </div>
            <div className={style['project-interview-compare-sidebar-body']}>
            {details.map(({ type }) => {
                return <div key={`${type}`} style={{ minHeight: `${heights[type]|| 0}px`}} className={style['project-interview-compare-sidebar-evaluation-label']}>
                    {labels[type]}</div>
            })}
            </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable direction="horizontal" droppableId='compare'>{
        (provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className={style['project-interview-compare-main']}>
            {_compare.map((c, index) => (
                <Draggable key={c.id}  data-test-id={`candidate-${index}`} draggableId={c.id} index={index}>{
                (provided) => (
                    <CandidateCompareColumn
                        onHeights={handleColumnHeights}
                        id={`candidate-compare-column-${index}`}
                        heights={heights}
                        toggleRow={handleRowToggle}
                        onDelete={() => onCompareRemove(c)}
                        active={activeRows}
                        className={style['project-interview-compare-column']}
                        compare={c}
                        evaluations={details.map(d => ({
                            type: d.type,
                            evaluation: d.evaluations[index]
                        }))}
                        dragProps={provided}
                        />
                    )}</Draggable>
            ))}
        </div>)
        }</Droppable></DragDropContext>
        {
            _compare.length - offset > 4 ?
            <button className={style['project-interview-compare-next']} onClick={() => setOffset(offset + 1)}>
                <ArrowSharpRightIcon className={style['project-interview-compare-next-icon']} />
            </button> :
            null
        }

        {
            offset > 0 ? 
            <button className={style['project-interview-compare-prev']} onClick={() => setOffset(offset - 1)}>
                <ArrowSharpLeftIcon className={style['project-interview-compare-prev-icon']} />
            </button> :
            null
        }
    </div>
}

export default ProjectInterviewCompare;