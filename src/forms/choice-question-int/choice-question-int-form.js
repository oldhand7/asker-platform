import classNames from 'classnames';
import RadioInputField from 'components/RadioInputField/RadioInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useTranslation } from 'libs/translation';

import styles from './choice-question-int-form.module.scss';

const ChoiceQuestionIntForm = ({ className, question, values, onValues }) => {
  const { i18nField } = useTranslation();

  return <div className={classNames(styles['choice-question-int-form'], className)}>
    <h3 className={styles['choice-question-int-form-title']}>{i18nField(question.name)}</h3>
    <div className={styles['choice-question-int-form-desc']}
    dangerouslySetInnerHTML={{ __html: striptags(i18nField(question.desc), allowedHtmlTags) }}></div>

    <ul data-test-id="question-answers" className={styles['choice-question-int-form-answers']} onChange={ev => onValues([question.answers.find(a => a.uid == ev.target.value)])}>
      {(question.answers || []).map((answer, index) => {
        const answerLabelInt = i18nField(answer.name);

        return <li key={`a${index}`} className={styles['choice-question-int-form-answers-answer']}>
          <RadioInputField
            name={`q${question.id}`}
            className={styles['choice-question-int-form-answers-input']}
            key={index} value={answer.uid} checked={(values || []).find(a => a.uid == answer.uid)} label={answerLabelInt} />
        </li>
    })}
    </ul>
  </div>
}

export default ChoiceQuestionIntForm;
