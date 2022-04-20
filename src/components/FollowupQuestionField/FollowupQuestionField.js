import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import FollowupQuestionForm from 'forms/followup-question/followup-question-form';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './FollowupQuestionField.module.scss';

const FollowupQuestionField = ({ className, questions, onChange }) => {
  const handleFollowupQuestion = question => {
    if (questions.length >= 10) {
      return;
    }

    onChange([
      ...questions,
      question.name
    ])
  }

  const handleQuestionDelete = question => {
    onChange([
      ...questions.filter(q => q !== question)
    ])
  }

  return <div data-test-id="followup-question-field" className={classNames(styles['followup-question-field'], className)}>
    <span className={styles['followup-question-field-label']}>
      Follow-up questions
      <small>Optional</small>
    </span>

    <ul className={styles['followup-question-field-list']}>
      {questions.map((q, index) => <li key={`q${q}`} className={styles['followup-question-field-list-item']}>
        <span className={styles['followup-question-field-list-item']}>{q}</span>
        <TrashButton onClick={() => handleQuestionDelete(q)} />
      </li>)}
    </ul>

    <FollowupQuestionForm className={styles['followup-question-field-form']} onValues={handleFollowupQuestion} />
  </div>
}

export default FollowupQuestionField;
