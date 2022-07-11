import classNames from "classnames";
import PlusIcon from "components/Icon/PlusIcon";
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';

import styles from './QuestionExplorerQuestionList.module.scss';


const SelectButton = (props) => (<button data-test-id="add-question" type="button" {...props} className={styles['question-explorer-question-list-question-add']}>
    <PlusIcon className={styles['question-explorer-question-list-question-add-icon']} />
    <span className={styles['question-explorer-question-list-question-add-text']}>Select</span>
</button>)


const QuestionExplorerQuestionList = ({ className, questions = [], onQuestion }) => {
    //
    return <ul className={classNames(
        styles['question-explorer-question-list'],
        className
    )}>
        {questions.map(q => {
            let type;

            if (q.type == 'screening' || q.type == 'other') {
                type = getScreeningQuestionLabelBySubtype(q.subtype)
            }

            return <li data-company-id={q.companyId} key={q.id} className={styles['question-explorer-question-list-question']}>
                <h5 className={styles['question-explorer-question-list-question-name']}>
                    {q.name}
                </h5>
                <div className={styles['question-explorer-question-list-question-type']}>
                    {type}
                </div>
                <div className={styles['question-explorer-question-list-question-control']}>
                    <SelectButton onClick={() => onQuestion && onQuestion(q)} />
                </div>
            </li>;
        })}
    </ul>
}

export default QuestionExplorerQuestionList;