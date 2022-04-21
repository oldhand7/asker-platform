import { getCriteriaTypeById } from 'libs/criteria';
import classNames from 'classnames';
import QuestionScoreBoard from 'components/QuestionScoreBoard/QuestionScoreBoard';
import { useEffect, useState } from 'react';
import useForm from 'libs/use-form';
import { calcScore } from 'libs/helper';

import styles from './evaluation-question-int-form.module.scss';

const defaultValues = {
  criteria: null,
  score: 0,
  maxScore: 0,
  votes: []
}
const rules = {}
const messages = {}

const EvaluationQuestionIntForm = ({ className, question, stage, project, values, onValues, onError }) => {
  const [formValues, errors, control] = useForm({
    values: values ? { ...values } : defaultValues,
    rules,
    messages
  })
  const [criteria, setCriteria] = useState(null);

  useEffect(() => {
    if (!values && question) {
      const dummyVotes = question.rules.map(rule => ({
        head: false,
        tail: rule.steps ? rule.steps.map(s => false) : []
      }))

      control.setValues({
        criteria: question.criteria,
        score: 0,
        maxScore: question.rules.length,
        votes: dummyVotes
      })
    }
  }, [question, values])

  useEffect(() => {
    if (question) {
      setCriteria(getCriteriaTypeById(question.criteria.type))
    } else {
      setCriteria(null)
    }
  }, [question])

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error('Some fields not valid'))
    }
  }, [formValues])


  const handleVotes = (votes) => {
    control.setValues({
      ...formValues,
      score: calcScore(votes),
      votes: votes
    })
  }

  return question ? <div className={classNames(styles['evaluation-question-int-form'], className)}>
    <div className={styles['evaluation-question-int-form-block']}>
      <h2 className={styles['evaluation-question-int-form-title']}>{criteria && `${criteria.altName || criteria.name} question`}</h2>
      <div className={styles['evaluation-question-int-form-criteria']}>
        <h2 className={styles['evaluation-question-int-form-criteria-name']}>{question && question.criteria.name}</h2>
        <p className={styles['evaluation-question-int-form-criteria-desc']}>{question && question.criteria.desc}</p>
      </div>
      <h2 className={styles['evaluation-question-int-form-question-title']}>Question</h2>
      <h2 className={styles['evaluation-question-int-form-question-name']}>{question.name}</h2>
      <ul className={styles['evaluation-question-int-form-question-questions']}>
        {(question.followup || []).map((fq, index) => (
          <li className={styles['evaluation-question-int-form-question-questions-question']} key={index}>{fq}</li>
        ))}
      </ul>
    </div>
    {/*@TODO: notes */}
    <QuestionScoreBoard score={formValues.score} votes={formValues.votes} onVotes={handleVotes} className={styles['evaluation-question-int-form-sb']} rules={question.rules} />
  </div> : null
}

export default EvaluationQuestionIntForm;
