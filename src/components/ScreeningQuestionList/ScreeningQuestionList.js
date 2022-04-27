import classNames from 'classnames';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './ScreeningQuestionList.module.scss';

const ScreeningQuestionList = ({ title = 'Selected questions', className, questions, onChange }) => {

  const handleQuestionDel = (question) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    onChange(questions.filter(q => q != question))
  }

  return <div className={styles['screening-question-list']}>
    <h3 className={styles['screening-question-list-title']}>{title}</h3>

    <ul className={styles['screening-question-list-questions']}>
      {questions.map((q, index) => (
        <li key={`${q.id}${index}`} className={styles['screening-question-list-questions-question']}>
          <span className={styles['screening-question-list-questions-question-name']}>{q.name}</span>
          <span className={styles['screening-question-list-questions-question-type']}>{getScreeningQuestionLabelBySubtype(q.subtype)}</span>
          <div className={styles['screening-question-list-questions-question-control']}>
            <TrashButton className={styles['screening-question-list-questions-question-remove']} onClick={() => handleQuestionDel(q)} />
          </div>
        </li>
      ))}
    </ul>

    {!questions.length ? <p className={styles['screening-question-list-warning']}>No questions yet.</p> : null}
  </div>
}

export default ScreeningQuestionList;
