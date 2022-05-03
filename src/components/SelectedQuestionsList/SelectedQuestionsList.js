import classNames from 'classnames';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './SelectedQuestionsList.module.scss';

const SelectedQuestionsList = ({ title = 'Selected questions', className, questions, onChange }) => {

  const handleQuestionDel = (question) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    onChange(questions.filter(q => q != question))
  }

  return <div className={classNames(styles['selected-question-list'], className)}>
    <h3 className={styles['selected-question-list-title']}>{title}</h3>

    <ul className={styles['selected-question-list-questions']}>
      {questions.map((q, index) => (
        <li data-company-id={q.companyId}  key={`${q.id}${index}`} className={styles['selected-question-list-questions-question']}>
          <span className={styles['selected-question-list-questions-question-name']}>{q.name}</span>

          {
            q.type == 'screening' || q.type == 'other' ?
            <span className={styles['selected-question-list-questions-question-type']}>
              {getScreeningQuestionLabelBySubtype(q.subtype)}
            </span> :
            <span></span>
          }


          <div className={styles['selected-question-list-questions-question-control']}>
            <TrashButton className={styles['selected-question-list-questions-question-remove']} onClick={() => handleQuestionDel(q)} />
          </div>
        </li>
      ))}
    </ul>

    {!questions.length ? <p className={styles['selected-question-list-warning']}>No questions yet.</p> : null}
  </div>
}

export default SelectedQuestionsList;
