import classNames from 'classnames';
import useForm from 'libs/use-form';
import {criteriaTypes} from 'libs/criteria';
import PlatformButton from 'components/Button/PlatformButton';
import CriteriaOptionInputField from 'components/CriteriaOptionInputField/CriteriaOptionInputField';
import QuestionScoreInputField from 'components/QuestionScoreInputField/QuestionScoreInputField';
import { useUser } from 'libs/user';
import { useState, useEffect } from 'react';
import { saveCollectionDocument } from 'libs/firestore';
import TextInputField from 'components/TextInputField/TextInputField';
import Preloader from 'components/Preloader/Preloader';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import FollowupQuestionField from 'components/FollowupQuestionField/FollowupQuestionField';
import Alert from 'components/Alert/Alert';
import { addFlash } from 'libs/flash';
import { useRouter } from 'next/router';

import styles from './question-form.module.scss';

const defaultValues = {
  name: '',
  criteria: null,
  desc: '',
  followup: [],
  rules: []
}

const validationRules = {
  name: 'required|max:140',
  desc: 'max:280',
  followup: 'max:10',
  criteria: 'required'
}

const QuestionForm = ({ className, question, criteria}) => {
  const [values, errors, control] = useForm({
    values: question ? question : { ...defaultValues, rules: criteria.rules },
    rules: validationRules
  })
  const [user] = useUser();
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
    values.userId = user.profile.uid;

    saveCollectionDocument('questions', values)
      .then(() => {
        if (question && !clone) {
          addFlash('Question saved', 'success')
        } else {
          addFlash('Question created', 'success')
        }

        router.push('/questions/')
      })
      .catch(setError)
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

  const handleCriteriaOption = option => {
    control.set('criteria', {
      id: option.id,
      name: option.name,
      type: criteria.id
    })
  }

  return <form onSubmit={control.submit(handleSubmit, handleSubmitFailure)} className={classNames(styles['question-form'], className)}>
    {error ? <Alert type="error">{error.message}</Alert> : null}

    <div className={styles['question-form-wrapper']}>
      <h2 className={styles['question-form-title']}>{criteria.cta}</h2>
      <p className={styles['question-form-desc']}>{criteria.desc}</p>
      <CriteriaOptionInputField error={errors && errors['criteria']} value={values.criteria} criteria={criteria} onChange={control.input('criteria', false)} className={styles['question-form-input-field']} />
      <TextInputField value={values.name}  error={errors && errors['name']} autoComplete="off" name="name" onChange={control.input('name')} label="Question" placeholder="Write your question here" className={styles['question-form-input-field']} />
      <TextareaInputField value={values.desc}  error={errors && errors['desc']} name="desc" onChange={control.input('desc')} label="Definition" placeholder="Write your definition here" className={styles['question-form-input-field']} />
      <FollowupQuestionField questions={values.followup} onChange={control.input('followup', false)} className={styles['question-form-input-field']} />
    </div>

    <QuestionScoreInputField  className={styles['question-form-input-field']} rules={values.rules} onChange={control.input('rules', false)}  />

    <PlatformButton disabled={loading} className={styles['question-form-submit']} type="submit">
      {!loading ?  'Save question' : 'Loading...'}
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default QuestionForm;
