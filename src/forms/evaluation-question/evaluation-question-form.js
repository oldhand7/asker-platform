import classNames from 'classnames';
import useForm from 'libs/use-form';
import PlatformButton from 'components/Button/PlatformButton';
import CriteriaOptionInputField from 'components/CriteriaOptionInputField/CriteriaOptionInputField';
import QuestionScoreInputField from 'components/QuestionScoreInputField/QuestionScoreInputField';
import { useUser } from 'libs/user';
import { useState } from 'react';
import { saveCollectionDocument } from 'libs/firestore';
import TextInputField from 'components/TextInputField/TextInputField';
import Preloader from 'components/Preloader/Preloader';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import FollowupQuestionField from 'components/FollowupQuestionField/FollowupQuestionField';
import Alert from 'components/Alert/Alert';
import { addFlash } from 'libs/flash';
import { useRouter } from 'next/router';
import { error } from 'libs/helper';

import styles from './evaluation-question-form.module.scss';

const EVALUATION_SUBTYPES_NO_CRITERIA = ['culture-fit', 'motivation'];

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
  name: 'required|max:140',
  desc: 'max:9000',
  followup: 'max:10',
  criteria: EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type.id) != -1 ? '' : 'required'
})

const EvaluationQuestionForm = ({ className, question, subtype, onValues }) => {
  const [values, errors, control] = useForm({
    values: question ? question : { ...defaultValues, rules: subtype.rules },
    rules: createValidationRules(subtype)
  })
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  const handleSubmit = values => {
    setLoading(true)

    let clone = question && question.companyId == 'asker';

    if (clone) {
      delete values.id;
    }

    values.companyId = user.companyId
    values.userId = user.id;
    values.followupCount = values.followup.length

    if (!values.subtype) {
      values.subtype = subtype.id
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
      <h2 className={styles['evaluation-question-form-title']}>{question ? `Edit ${subtype.altName.toLowerCase()} question` : subtype.cta}</h2>
      {!question ? <p className={styles['evaluation-question-form-desc']}>{subtype.desc}</p> : null}

      {
        EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(subtype.id) == -1 ?
        <CriteriaOptionInputField error={errors && errors['criteria']} value={values.criteria} type={subtype} onChange={control.input('criteria', false)} className={styles['evaluation-question-form-input-field']} /> :
        null
      }

      <TextInputField value={values.name}  error={errors && errors['name']} autoComplete="off" name="name" onChange={control.input('name')} label="Question" placeholder="Write your question here" className={styles['evaluation-question-form-input-field']} />
      {
        subtype.id == 'competency' ?
       <TextareaInputField value={values.desc}  error={errors && errors['desc']} name="desc" onChange={control.input('desc')} label="Definition" placeholder="Write your definition here" className={styles['evaluation-question-form-input-field']} /> :
       null
      }
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
