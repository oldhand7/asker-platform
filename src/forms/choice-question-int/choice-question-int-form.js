import classNames from 'classnames';
import RadioInputField from 'components/RadioInputField/RadioInputField';

import styles from './choice-question-int-form.module.scss';

const ChoiceQuestionIntForm = ({ className, question, values, onValues }) => {
  return <div className={classNames(className)}>
    <h3>{question.name}</h3>
    <p>{question.desc}</p>

    <ul data-test-id="question-answers" className={styles['choice-question-int-form-answers']} onChange={ev => onValues([ev.target.value])}>
      {(question.answers || []).map((a, index) => (
        <li key={`a${index}`} className={styles['choice-question-int-form-answers-answer']}>
          <RadioInputField
            name={`q${question.id}`}
            className={styles['choice-question-int-form-answers-input']}
            key={index} value={a} checked={(values || []).indexOf(a) > -1} label={a} />
        </li>
      ))}
    </ul>
  </div>
}

export default ChoiceQuestionIntForm;
