import classNames from 'classnames';
import FollowupQuestionForm from 'forms/followup-question/followup-question-form';
import TrashButton from 'components/TrashButton/TrashButton';
import { useForm } from 'libs/react-hook-form';

import styles from './FollowupQuestionField.module.scss';
import { useSite } from 'libs/site';

const FollowupQuestionField = ({ className, questions, onChange }) => {
  const { i18nField, t } = useSite()

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
      {t('Follow-up questions')}
      <small>{t('Optional')}</small>
    </span>

    <ul className={styles['followup-question-field-list']}>
      {questions.map((q, index) => <li key={`q${index}`} className={styles['followup-question-field-list-item']}>
        <span className={styles['followup-question-field-list-item']}>{i18nField(q)}</span>
        <TrashButton className={styles['followup-question-field-list-item-remove']} onClick={() => handleQuestionDelete(q)} />
      </li>)}
    </ul>

    <FollowupQuestionForm className={styles['followup-question-field-form']} onValues={handleFollowupQuestion} />
  </div>
}

export default FollowupQuestionField;
