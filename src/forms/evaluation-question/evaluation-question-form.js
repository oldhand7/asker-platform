import classNames from 'classnames';
import {useForm} from 'libs/form';
import PlatformButton from 'components/Button/PlatformButton';
import CriteriaOptionInputField from 'components/CriteriaOptionInputField/CriteriaOptionInputField';
import QuestionScoreInputField from 'components/QuestionScoreInputField/QuestionScoreInputField';
import { useUser } from 'libs/user';
import { useState } from 'react';
import { saveCollectionDocument } from 'libs/firestore';
import TextInputField from 'components/TextInputField/TextInputField';
import Preloader from 'components/Preloader/Preloader';
import FollowupQuestionField from 'components/FollowupQuestionField/FollowupQuestionField';
import Alert from 'components/Alert/Alert';
import { addFlash } from 'libs/flash';
import { useRouter } from 'next/router';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import { EVALUATION_CRITERIA_TYPES } from 'libs/criteria';

import styles from './evaluation-question-form.module.scss';

const EVALUATION_SUBTYPES_NO_CRITERIA = ['culture-fit', 'motivation'];

const HEADLINES = {
  'competency': {
    edit: 'Edit competency question',
    create: 'Create a new competency based question'
  },
  'experience': {
    edit: 'Edit experience question',
    create: 'Create a new experience based question'
  },
  'motivation': {
    edit: 'Edit motivation question',
    create: 'Create a new motivation based question'
  },
  'culture-fit': {
    edit: 'Edit culture-fit question',
    create: 'Create a new culture-fit based question'
  },
  'hard-skill': {
    edit: 'Edit hard-skill question',
    create: 'Create a new hard-skill based question'
  },
}

const defaultValues = {
  name: '',
  criteria: null,
  desc: '',
  type: 'evaluation',
  subtype: '',
  followup: [],
  followupCount: 0,
  rules: []
}

const createValidationRules = type => ({
  name: 'required|max:250',
  desc: 'max:9000',
  followup: 'max:10',
  criteria: EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type) != -1 ? '' : 'required'
})

const EvaluationQuestionForm = ({ className, question, type, onValues }) => {
  const {values, errors, control } = useForm({
    values: question ? question : { ...defaultValues, rules: EVALUATION_CRITERIA_TYPES[type].rules },
    rules: createValidationRules(type)
  })
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  const handleSubmit = values => {
    setLoading(true)

    let clone = question && question.companyId == 'asker' && user.companyId != 'asker';

    if (clone) {
      delete values.id;
    }

    values.companyId = user.companyId
    values.userId = user.id;
    values.followupCount = values.followup.length

    if (!values.subtype) {
      values.subtype = type
    }

    saveCollectionDocument('questions', values)
      .then(id => {
        if (onValues) {
          onValues({
            ...values,
            id
          });
        } else {

          if (question && !clone) {
            addFlash('Question saved', 'success')
          } else {
            addFlash('Question created', 'success')
          }

          router.push('/questions/')
        }
      })
      .catch(error => {
          setError(ctxError('Server error', error))
      })
  }

  const handleSubmitFailure = () => {
    setTimeout(() => {
        let errorEl = document.querySelector('.form-error')

        if (!errorEl) {
          errorEl = document.querySelector('.alert')
        }

        if (errorEl) {
          errorEl.scrollIntoView({
            block: 'center'
          })
        }
    }, 0)
  }

  return <form data-test-id="evaluation-question-form" onSubmit={control.submit(handleSubmit, handleSubmitFailure)} className={classNames(styles['evaluation-question-form'], className)}>
    {error ? <Alert type="error">{error.message}</Alert> : null}

    <div className={styles['evaluation-question-form-wrapper']}>
      <h2 className={styles['evaluation-question-form-title']}>{question ? HEADLINES[type].edit : HEADLINES[type].create}</h2>
      {!question ? <p className={styles['evaluation-question-form-desc']}>{EVALUATION_CRITERIA_TYPES[type].desc}</p> : null}

      {
        EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type) == -1 ?
        <CriteriaOptionInputField error={errors && errors['criteria']} value={values.criteria} type={type} onChange={control.input('criteria', false)} className={styles['evaluation-question-form-input-field']} /> :
        null
      }

      <TextInputField value={values.name}  error={errors && errors['name']} autoComplete="off" name="name" onChange={control.input('name')} label="Question" placeholder="Write your question here" className={styles['evaluation-question-form-input-field']} />

      <HtmlInputField value={values.desc}  error={errors && errors['desc']} name="desc" onChange={control.input('desc', false)} label="Definition" placeholder="Notes for interviewer" className={styles['evaluation-question-form-input-field']} />

      <FollowupQuestionField questions={values.followup} onChange={control.input('followup', false)} className={styles['evaluation-question-form-input-field']} />
    </div>

    <QuestionScoreInputField  className={styles['evaluation-question-form-input-field']} rules={values.rules} onChange={control.input('rules', false)}  />

    <PlatformButton disabled={loading} className={styles['evaluation-question-form-submit']} type="submit">
      {!loading ?  (question ? 'Save question' : 'Add question') : 'Loading...'}
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default EvaluationQuestionForm;
