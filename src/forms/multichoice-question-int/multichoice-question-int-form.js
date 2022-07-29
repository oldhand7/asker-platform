import classNames from 'classnames';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useForm } from 'libs/react-hook-form';
import { useSite } from 'libs/site';

import styles from './multichoice-question-int-form.module.scss';
import { useEffect } from 'react';

const MultichoiceQuestionIntForm = ({ className, question, values = [], onValues }) => {
  const { i18nField } = useSite()

  const { setValue, values: formValues } = useForm({
    values: {
      answers: values || []
    }
  })

  const toggleAnswer = answer => {
    const exist = formValues.answers.find(a => a.uid === answer.uid);

    let newAnswers = formValues.answers;
    
    if (exist) {
      newAnswers = newAnswers.filter(a => a.uid != answer.uid);
    } else {
      newAnswers.push(answer)
    }

    setValue('answers', newAnswers)
  }

  useEffect(() => {
    if (JSON.stringify(values) != JSON.stringify(formValues.answers)) {
      onValues && onValues(formValues.answers)
    }
  }, [values, formValues])

  const questionNameInt = i18nField(question.name);
  const questionDescInt = i18nField(question.desc);

  return <div className={classNames(styles['multichoice-question-int-form'], className)}>
    <h3 className={styles['multichoice-question-int-form-title']}>{questionNameInt}</h3>
    <div className={styles['multichoice-question-int-form-desc']}
    dangerouslySetInnerHTML={{ __html: striptags(questionDescInt, allowedHtmlTags) }}></div>

    <ul data-test-id="question-answers" className={styles['multichoice-question-int-form-answers']}>
      {(question.answers || []).map((answer, index) => {
        const answerIntLabel = i18nField(answer.name);
        
        return <li key={`a${index}`} className={styles['multichoice-question-int-form-answers-answer']}>
          <CheckboxInputField
            name={`q${question.id}`}
            className={styles['multichoice-question-int-form-answers-input']}
            onChange={_ => toggleAnswer(answer)}
            key={index} checked={!!formValues.answers.find(a => a.uid == answer.uid)} label={answerIntLabel} />
        </li>
      })}
    </ul>
  </div>
}

export default MultichoiceQuestionIntForm;
