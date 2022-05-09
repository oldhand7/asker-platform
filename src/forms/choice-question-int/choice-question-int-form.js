import classNames from 'classnames';
import RadioInputField from 'components/RadioInputField/RadioInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './choice-question-int-form.module.scss';

const ChoiceQuestionIntForm = ({ className, question, values, onValues }) => {
  return <div className={classNames(styles['choice-question-int-form'], className)}>
    <h3 className={styles['choice-question-int-form-title']}>{question.name}</h3>
    <div className={styles['choice-question-int-form-desc']}
    dangerouslySetInnerHTML={{ __html: striptags(question.desc, allowedHtmlTags) }}></div>

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
