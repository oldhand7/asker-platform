import { getCriteriaTypeById } from 'libs/criteria';
import classNames from 'classnames';
import QuestionScoreBoard from 'components/QuestionScoreBoard/QuestionScoreBoard';
import { useEffect, useState, useCallback } from 'react';
import useForm from 'libs/use-form';
import { calcScore, createDummyVotes } from 'libs/helper';
import InterviewNotes from 'components/InterviewNotes/InterviewNotes';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './evaluation-question-int-form.module.scss';

const defaultValues = {
  notes: '',
  criteria: null,
  score: 0,
  maxScore: 0,
  votes: []
}
const rules = {}
const messages = {}

const adjust = (values, question) => {
  values.criteria = question.criteria;
  values.subtype = question.subtype;
  values.maxScore = question.rules.length;

  if (values.votes.length != question.rules.length) {
    values.votes = createDummyVotes(question.rules);
  }

  return values;
}

const EvaluationQuestionIntForm = ({ className, question, stage, project, values, onValues, onError }) => {
  const [formValues, errors, control] = useForm({
    values: adjust(
      values ? values : defaultValues,
      question
    ),
    rules,
    messages
  })
  const [criteria, setCriteria] = useState(null);

  useEffect(() => {
    if (question) {
      setCriteria(getCriteriaTypeById(question.subtype))
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

  useEffect(() => {
    const adjust = {}

    if (!formValues.subtype && question) {
      control.set('subtype', question.subtype)
    }

    if (!formValues.maxScore && question.rules.length) {
      control.set('subtype', question.subtype)
    }
  }, [question, formValues])

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

      {EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(question.subtype) == -1 ?
        <div className={styles['evaluation-question-int-form-criteria']}>
          <h2 className={styles['evaluation-question-int-form-criteria-name']}>{question && question.criteria.name}</h2>
          <div
            className={styles['evaluation-question-int-form-criteria-desc']}
            dangerouslySetInnerHTML={{__html: striptags(
              question && question.criteria && question.criteria.desc,
              allowedHtmlTags)}}></div>
        </div> : null}

      <h2 className={styles['evaluation-question-int-form-question-title']}>Question</h2>
      <h2 className={styles['evaluation-question-int-form-question-name']}>{question.name}</h2>
      <div
        className={styles['evaluation-question-int-form-question-desc']}
        dangerouslySetInnerHTML={{__html: striptags(
          question && question.desc, allowedHtmlTags)}}></div>

      <ul className={styles['evaluation-question-int-form-question-questions']}>
        {(question.followup || []).map((fq, index) => (
          <li className={styles['evaluation-question-int-form-question-questions-question']} key={index}>{fq}</li>
        ))}
      </ul>
    </div>
    <div className={styles['evaluation-question-int-form-block']}>
      <InterviewNotes className={styles['evaluation-question-int-form-notes']} value={formValues.notes} onChange={control.input('notes', false)} />
    </div>
    <QuestionScoreBoard score={formValues.score} votes={formValues.votes} onVotes={handleVotes} className={styles['evaluation-question-int-form-sb']} rules={question.rules} />
  </div> : null
}

export default EvaluationQuestionIntForm;
