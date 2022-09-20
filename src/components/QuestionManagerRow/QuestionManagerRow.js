import EditButton from "components/EditButton/EditButton";
import DragIcon from "components/Icon/DragIcon";
import TrashButton from "components/TrashButton/TrashButton";
import NoteButton from "components/NoteButton/NoteButton";
import classNames from "classnames";
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import MinutesInput from "components/MinutesInput/MinutesInput";
import { useTranslation } from "libs/translation";

import styles from './QuestionManagerRow.module.scss';

const QuestionManagerRow = ({ className, question, time = 0, note = '', onEdit, onTimeChange, onDelete, onNote }) => {
    const { i18nField, t } = useTranslation()

    return <div
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
                <div className={styles['question-manager-row-type']}>{getScreeningQuestionLabelBySubtype(question.subtype, t)}</div> :
                <div className={styles['question-manager-row-type']}>{question.criteria && i18nField(question.criteria.name)}</div>
            }

            <div className={styles['question-manager-row-control']}>
                <MinutesInput className={styles['question-manager-row-control-time']} value={time} onChange={onTimeChange} />
                <EditButton onClick={onEdit} className={styles['question-manager-row-control-button']} />
                {question.type == 'evaluation' ? <NoteButton active={note} onClick={onNote} className={styles['question-manager-row-control-button']} /> : null}
                <TrashButton onClick={onDelete} className={styles['question-manager-row-control-button']} />
            </div>
        </div>
    </div>
}

export default QuestionManagerRow;