import classNames from "classnames";
import PlusIcon from "components/Icon/PlusIcon";
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import { useSite } from "libs/site";

import styles from './QuestionExplorerQuestionList.module.scss';


const SelectButton = (props) => (<button data-test-id="add-question" type="button" {...props} className={styles['question-explorer-question-list-question-add']}>
    <PlusIcon className={styles['question-explorer-question-list-question-add-icon']} />
    <span className={styles['question-explorer-question-list-question-add-text']}>Select</span>
</button>)


const QuestionExplorerQuestionList = ({ className, questions = [], onQuestion }) => {
    const { i18nField }  = useSite();
    
    return <ul data-test-id="question-explorer-questions" className={classNames(
        styles['question-explorer-question-list'],
        className
    )}>
        {questions.map(q => {
            let type;

            if (q.type == 'screening' || q.type == 'other') {
                type = getScreeningQuestionLabelBySubtype(q.subtype)
            } else {
                type = q.criteria && i18nField(q.criteria.name)
            }

            return <li data-company-id={q.companyId} key={q.id} className={styles['question-explorer-question-list-question']}>
                <h5 className={styles['question-explorer-question-list-question-name']}>
                    {i18nField(q.name)}
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