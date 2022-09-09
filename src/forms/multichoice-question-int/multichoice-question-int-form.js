import classNames from 'classnames';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useForm } from 'libs/react-hook-form';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';

import styles from './multichoice-question-int-form.module.scss';

const MultichoiceQuestionIntForm = ({ className, question, values = [], onValues }) => {
  const { i18nField } = useTranslation()

  const initValues = useMemo(() => ({
    answers: values || []
  }), [])

  const {
    setValue,
    control
  } = useForm({
    values: initValues
  })

  const answers = useWatch({
    control,
    name: 'answers',
    defaultValue: initValues.answers
  })

  const toggleAnswer = answer => {
    const exist = answers.find(a => a.uid === answer.uid);

    let copy = [...answers];
    
    if (exist) {
      copy = copy.filter(a => a.uid != answer.uid);
    } else {
      copy.push(answer)
    }

    setValue('answers', copy)
  }

  useEffect(() => {
      onValues && onValues(answers)
  }, [answers, onValues])

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
            key={index}
            checked={!!answers.find(a => a.uid == answer.uid)}
            label={answerIntLabel} />
        </li>
      })}
    </ul>
  </div>
}

export default MultichoiceQuestionIntForm;
