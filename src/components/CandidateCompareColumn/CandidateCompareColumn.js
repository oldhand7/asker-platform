import classNames from "classnames";
import CriteriaRating from "components/CriteriaRating/CriteriaRating";
import EvaluationScoreBar from "components/EvaluationScoreBar/EvaluationScoreBar";
import TrashIcon from "components/Icon/TrashIcon";
import InterviewScore from "components/InterviewScore/InterviewScore";
import { COLOR_MAP } from 'libs/config';
import { useEffect, useLayoutEffect, useRef } from "react";
import ScreeningEvaluationLabel from 'components/ScreeningEvaluationLabel/ScreeningEvaluationLabel';

import styles from './CandidateCompareColumn.module.scss';

function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);
  
    return Math.ceil(el.offsetHeight + margin);
  }

const TinyTrashButton  = ({ onClick, className }) => (<button data-test-id="trash-button" onClick={onClick} className={className}>
<span className={styles['candidate-compare-column-delete-text']}>Delete</span>
<TrashIcon className={styles['candidate-compare-column-delete-icon']} />
</button>)

const CandidateCompareColumn = ({ className, toggleRow, compare, evaluations, active = {}, onDelete, heights = {}, onHeights, id ='', dragProps }) => {
const itemsRef = useRef({});

const calcHeights = () => {
    if (onHeights) {
        const heights = {}

        for (let key in itemsRef.current) {
            if (itemsRef.current[key]) {
                heights[key] = itemsRef.current[key].getBoundingClientRect().height;
                
            }
        }

        onHeights(heights)
    }
}

useEffect(calcHeights, [active])
useEffect(calcHeights, [])

const toggleRowLocal = (type) => {
    if (toggleRow) {
        toggleRow(type)
    }

    calcHeights()
}

useEffect(() => {
    window.addEventListener('resize', calcHeights)
    window.addEventListener('load', calcHeights)

    return () => {
        window.removeEventListener('resize', calcHeights)
        window.removeEventListener('load', calcHeights)
    }
}, [])

return <div data-test-id="candidate-compare-column" className={classNames(
        styles['candidate-compare-column'],
        className
        )}
        id={id}
        ref={dragProps.innerRef}
        {...dragProps.draggableProps}
        {...dragProps.dragHandleProps}
    >
        <div className={styles['candidate-compare-column-head']}>
            <h4 className={styles['candidate-compare-column-title']}>{compare.candidate.name}</h4>
            <InterviewScore className={styles['candidate-compare-column-score']} score={compare.score || 0} />
            <TinyTrashButton className={styles['candidate-compare-column-delete']} onClick={onDelete}/>
        </div>
        <div className={styles['candidate-compare-column-body']}>
        {evaluations.map(({ type, evaluation }) => {
            const screeningType = type == 'screening-questions' || type == 'other-questions';

            let exclude = null;

            if (screeningType) {
                exclude = evaluation.find(({question}) => question.subtype == 'choice')
            }

            const hasChildren = evaluation.children || (screeningType && (!exclude || exclude && evaluation.length -1 > 0))

            return <div key={type} ref={el => itemsRef.current[type] = el} style={{ minHeight: active[type] && heights[type] ? `${heights[type]}px` : '0' }} className={classNames(
                styles['candidate-compare-column-evaluation'],
                styles[`candidate-compare-column-evaluation-${type}`],
                hasChildren ? styles['candidate-compare-column-evaluation-has-children'] : ''
            )}
            data-test-id={`candidate-compare-column-evaluation`}
            >
                <div onClick={() => hasChildren && toggleRowLocal(type)} className={styles['candidate-compare-column-evaluation-head']}>
                    {
                        screeningType ?
                        (exclude && <ScreeningEvaluationLabel className={styles['candidate-compare-column-evaluation-screening-popup-answer']} evaluation={exclude} />) : 
                        <EvaluationScoreBar
                        className={styles['candidate-compare-column-evaluation-criteria-score']}
                        value={evaluation.score} color={COLOR_MAP[type]} />
                    }
                </div>
                {active[type] ?
                <div className={styles['candidate-compare-column-evaluation-body']}>
                    {
                    screeningType ?
                    evaluation.filter(e => e != exclude).map(e => <ScreeningEvaluationLabel key={e.question.id} className={styles['candidate-compare-column-evaluation-screening-answer']} evaluation={e} />) :
                    <>
                    {evaluation.children.map(e => (
                        <div className={styles['candidate-compare-column-evaluation-rating']} key={e.id}>
                            <span className={styles['candidate-compare-column-evaluation-rating-name']}>{e.name}</span>
                            <CriteriaRating color={COLOR_MAP[type]} className={styles['candidate-compare-column-evaluation-rating-value']} value={e.score} />
                        </div>
                    ))}
                    </>}
                </div> : null}
            </div>
        })}
        </div>
    </div>
}

export default CandidateCompareColumn;