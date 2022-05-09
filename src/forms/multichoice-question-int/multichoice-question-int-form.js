import classNames from 'classnames';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './multichoice-question-int-form.module.scss';

const MultichoiceQuestionIntForm = ({ className, question, values = [], onValues }) => {
  const toggleAnswer = answer => {
    const exist = (values || []).indexOf(answer) > -1;

    if (onValues) {
      onValues(exist ? values.filter(a => a != answer) : [...(values || []), answer])
    }
  }

  return <div className={classNames(styles['multichoice-question-int-form'], className)}>
    <h3 className={styles['multichoice-question-int-form-title']}>{question.name}</h3>
    <div className={styles['multichoice-question-int-form-desc']}
    dangerouslySetInnerHTML={{ __html: striptags(question.desc, allowedHtmlTags) }}></div>

    <ul data-test-id="question-answers" className={styles['multichoice-question-int-form-answers']}>
      {(question.answers || []).map((a, index) => (
        <li key={`a${index}`} className={styles['multichoice-question-int-form-answers-answer']}>
          <CheckboxInputField
            name={`q${question.id}`}
            className={styles['multichoice-question-int-form-answers-input']}
            onChange={_ => toggleAnswer(a)}
            key={index} checked={(values || []).indexOf(a) > -1} label={a} />
        </li>
      ))}
    </ul>
  </div>
}

export default MultichoiceQuestionIntForm;
