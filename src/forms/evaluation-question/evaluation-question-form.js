import classNames from 'classnames';
import {useForm} from 'libs/react-hook-form';
import PlatformButton from 'components/Button/PlatformButton';
import CriteriaOptionInputField from 'components/CriteriaOptionInputField/CriteriaOptionInputField';
import QuestionScoreInputField from 'components/QuestionScoreInputField/QuestionScoreInputField';
import { useUser } from 'libs/user';
import { useMemo, useState } from 'react';
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
import { useSite } from 'libs/site';

const EVALUATION_SUBTYPES_NO_CRITERIA = ['culture', 'motivation'];

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
  'culture': {
    edit: 'Edit culture question',
    create: 'Create a new culture based question'
  },
  'hard-skill': {
    edit: 'Edit Hard skill question',
    create: 'Create a new Hard skill based question'
  },
}

const defaultValues = {
  name: {
    en: ''
  },
  criteria: null,
  desc: {
    en: ''
  },
  note: {
    en: ''
  },
  type: 'evaluation',
  subtype: '',
  followup: [],
  followupCount: 0,
  rules: []
}


const EvaluationQuestionForm = ({ className, question, type, onValues }) => {
  const { user, locale } = useUser();

  const validationRules = useMemo(() => {
    const rules = {
      [`name.${locale}`]: 'required|max:250',
      [`desc.${locale}`]: 'max:9000',
      [`note.${locale}`]: 'max:9000',
      followup: 'max:10',
    }

    if (EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type) == -1) {
      rules.criteria = 'required';
    }

    return rules;
  }, [locale, type])

  const {values, errors, input, handleSubmit } = useForm({
    values: question || { ...defaultValues, rules: EVALUATION_CRITERIA_TYPES[type].rules },
    rules: validationRules
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const { t } = useSite()

  const onSubmit = values => {
    setLoading(true)

    let clone = question && question.companyId == 'asker' && user.companyId != 'asker';

    if (clone) {
      delete values.id;
    }

    values.companyId = user.companyId
    values.userId = user.id;
    values.followupCount = values.followup.length
    
    if (values.criteria) {
      values.criteriaId = values.criteria.id;
    }

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
            addFlash(t('Question saved'), 'success')
          } else {
            addFlash(t('Question created'), 'success')
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

  return <form data-test-id="evaluation-question-form" onSubmit={handleSubmit(onSubmit, handleSubmitFailure)} className={classNames(styles['evaluation-question-form'], className)}>
    {error ? <Alert type="error">{error.message}</Alert> : null}

    <div className={styles['evaluation-question-form-wrapper']}>
      <h2 className={styles['evaluation-question-form-title']}>{question ? t(HEADLINES[type].edit) : t(HEADLINES[type].create)}</h2>
      {!question ? <p className={styles['evaluation-question-form-desc']}>{t(EVALUATION_CRITERIA_TYPES[type].desc)}</p> : null}

      {
        EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type) == -1 ?
        <CriteriaOptionInputField id="note" error={errors && errors['criteria']} value={values.criteria} type={type} onChange={input('criteria', false)} className={styles['evaluation-question-form-input-field']} /> :
        null
      }

      <TextInputField diff={locale} value={values.name[locale]}  error={errors && errors.name && errors.name[locale]} autoComplete="off" name={`name.${locale}`} onChange={input(`name.${locale}`)} label={t("Question")} placeholder={t("Write your question here")} className={styles['evaluation-question-form-input-field']} />
      <HtmlInputField id="note" value={values.note[locale]} diff={locale} error={errors && errors.note && errors.note[locale]} name={`note.${locale}`} onChange={input(`note.${locale}`, false)} label={t("Note")} placeholder={t("Notes for interviewer")} className={styles['evaluation-question-form-input-field']} />
      <FollowupQuestionField questions={values.followup} onChange={input('followup', false)} className={styles['evaluation-question-form-input-field']} />
    </div>

    <QuestionScoreInputField  className={styles['evaluation-question-form-input-field']} rules={values.rules} onChange={input('rules', false)}  />

    <PlatformButton disabled={loading} className={styles['evaluation-question-form-submit']} type="submit">
      {!loading ?  (question ? t('Save question') : t('Add question')) : t('Loading...')}
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default EvaluationQuestionForm;
