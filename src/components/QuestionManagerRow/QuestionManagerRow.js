import EditButton from "components/EditButton/EditButton";
import DragIcon from "components/Icon/DragIcon";
import TrashButton from "components/TrashButton/TrashButton";
import NoteButton from "components/NoteButton/NoteButton";
import classNames from "classnames";
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import { useSite } from "libs/site";

import styles from './QuestionManagerRow.module.scss';

const QuestionManagerRow = ({ className, question, dragDropProps, hasNote = false, onEdit, onDelete, onNote }) => {
    const { i18nField } = useSite()

    return <li
    data-test-id="selected-question"
    ref={dragDropProps.innerRef}
    {...dragDropProps.draggableProps}
    {...dragDropProps.dragHandleProps}
    className={classNames(
        styles['question-manager-row'],
        className
    )}>
        <div className={styles['question-manager-row-head']}>
            <DragIcon className={styles['question-manager-row-drag-handle']} />
        </div>
        <div className={styles['question-manager-row-body']}>
            <h5 title={i18nField(question.name)} className={styles['question-manager-row-title']}>
                <span>{i18nField(question.name)}</span>
            </h5>

            {
                question.type == 'screening' || question.type == 'other' ?
                <div className={styles['question-manager-row-type']}>{getScreeningQuestionLabelBySubtype(question.subtype+2)}</div> :
                <div className={styles['question-manager-row-type']}>{question.criteria && i18nField(question.criteria.name)}</div>
            }

            <div className={styles['question-manager-row-control']}>
                <EditButton onClick={onEdit} className={styles['question-manager-row-control-button']} />
                {question.type == 'evaluation' ? <NoteButton active={hasNote} onClick={onNote} className={styles['question-manager-row-control-button']} /> : null}
                <TrashButton onClick={onDelete} className={styles['question-manager-row-control-button']} />
            </div>
        </div>
    </li>
}

export default QuestionManagerRow;