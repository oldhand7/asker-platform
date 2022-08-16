import { getCriteriaTypeById } from 'libs/criteria';
import classNames from 'classnames';
import QuestionScoreBoard from 'components/QuestionScoreBoard/QuestionScoreBoard';
import { useEffect, useMemo, useState } from 'react';
import {useForm} from 'libs/form';
import { calcScore, createDummyVotes } from 'libs/helper';
import InterviewNotes from 'components/InterviewNotes/InterviewNotes';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';
import striptags from 'striptags';
import styles from './evaluation-question-int-form.module.scss';
import FlexRow from 'components/FlexRow/FlexRow';
import DismissAlert from 'components/DismissAlert/DismissAlert';
import Html from 'components/Html/Html'
import Tooltip from 'components/Tooltip/Tooltip';
import InfoIcon from 'components/Icon/InfoIcon'
import QuestionIcon from 'components/Icon/QuestionIcon';
import { useInView } from 'react-intersection-observer';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';

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

const QuestionCriteria = ({ criteria }) => {
  const { i18nField }  = useSite();

  const criteriaNameInt = i18nField(criteria.name);
  const criteriaDescInt = i18nField(criteria.desc);

  return <div className={styles['evaluation-question-int-form-criteria']}>
    <h2 className={styles['evaluation-question-int-form-criteria-name']}>
      <span>{criteriaNameInt}</span>
      {
        criteriaDescInt ?
        <Tooltip delay={0} text={striptags(criteriaDescInt)}>{ref => (
          <span className={styles['evaluation-question-int-form-criteria-icon']} ref={ref}><InfoIcon /></span>
        )}</Tooltip> :
        null
      }
    </h2>
</div>
}

const EvaluationQuestionIntForm = ({ className, question, values, markComplete, onValues, config, note, taxStageSecond, onError }) => {
  const { values: formValues, errors, control } = useForm({
    values: adjust(
      values ? values : defaultValues,
      question
    ),
    rules,
    messages
  })
  const [criteria, setCriteria] = useState(null);
  const { i18nField, t }  = useSite();
  const { locale } = useUser();

  const { ref, inView } = useInView({
    threshold: 0.7
  });

  useEffect(() => {
    if (inView && taxStageSecond) {
      const timeHandler = () => {
        taxStageSecond(question.id)
      }

      const int = setInterval(timeHandler, 1000)

      return () => clearInterval(int)
    }
  }, [inView, taxStageSecond, question])

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
      onError(new Error(t('Some fields not valid')))
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

    const voted = votes.some(v => v.head);

    if (voted) {
      markComplete(question.id)
    }
  }

  const questionNameInt = useMemo(() => i18nField(question.name), [locale, question]);
  const questionNoteInt = useMemo(() => {
    const customNote = config && config.notes && config.notes[question.id];

  
    return customNote ?  i18nField(customNote.text) : i18nField(question.note)
  }, [locale, question, config]);

  return question ? <div ref={ref} className={classNames(styles['evaluation-question-int-form'], className)}>
    <h2 className={styles['evaluation-question-int-form-title']}>
      {criteria && t(`${criteria.altName || criteria.name} question`)}</h2>

    <FlexRow className={styles['evaluation-question-int-form-flex-row']}>
      <div className={styles['evaluation-question-int-form-formulation']}>

        {EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(question.subtype) == -1 && question.criteria ?
          <QuestionCriteria criteria={question.criteria} /> : null}

        <h2 className={styles['evaluation-question-int-form-question-name']}>
          <QuestionIcon className={styles['evaluation-question-int-form-question-name-icon']} />
          <span>{questionNameInt}</span>
        </h2>

        <ul className={styles['evaluation-question-int-form-question-questions']}>
          {(question.followup || []).map((fq, index) => (
            <li className={styles['evaluation-question-int-form-question-questions-question']} key={index}>{i18nField(fq)}</li>
          ))}
        </ul>
      </div>

      <div className={styles['evaluation-question-int-form-notes']}>
        <InterviewNotes className={styles['evaluation-question-int-form-notes-input']} value={formValues.notes} onChange={control.input('notes', false)} />
            
        {questionNoteInt && !formValues.alertDismissed ?
          <DismissAlert className={styles['evaluation-question-int-form-alert']} onDismiss={() => control.set('alertDismissed', true)}>
            <Html>{questionNoteInt}</Html>
          </DismissAlert> : null}
        </div>
    </FlexRow>

    <QuestionScoreBoard score={formValues.score} votes={formValues.votes} onVotes={handleVotes} className={styles['evaluation-question-int-form-scoring-board']} rules={question.rules} />
  </div> : null
}

export default EvaluationQuestionIntForm;
