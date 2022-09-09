import classNames from 'classnames';
import {useForm} from 'libs/react-hook-form';
import PlatformButton from 'components/Button/PlatformButton';
import CriteriaOptionInputField from 'components/CriteriaOptionInputField/CriteriaOptionInputField';
import QuestionScoreInputField from 'components/QuestionScoreInputField/QuestionScoreInputField';
import { useUser } from 'libs/user';
import { useCallback, useMemo, useState } from 'react';
import { saveCollectionDocument } from 'libs/firestore';
import TextInputField from 'components/TextInputField/TextInputField';
import Preloader from 'components/Preloader/Preloader';
import FollowupQuestionForm from 'forms/followup-question/followup-question-form';
import Alert from 'components/Alert/Alert';
import { addFlash } from 'libs/flash';
import { useRouter } from 'next/router';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import { EVALUATION_CRITERIA_TYPES } from 'libs/criteria';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './evaluation-question-form.module.scss';

const EVALUATION_SUBTYPES_NO_CRITERIA = ['culture', 'motivation'];

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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const { t } = useTranslation()
  const { locale } = router;

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

  const validationMessages = useMemo(() => ({
    'required': t('errors.field.required'),
    'max.followup': t('errors.followup-max').replace('[n]', 10)
  }), [locale])

  const initValues = useMemo(() => {
    if (question) return question;

    return {
      ...defaultValues,
      rules: EVALUATION_CRITERIA_TYPES[type].rules
    }
  }, [])

  const {
    errors,
    handleSubmit,
    formState: { isSubmitted },
    setValue,
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues })

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
            addFlash(t('status.question-saved'), 'success')
          } else {
            addFlash(t('status.question-created'), 'success')
          }

          router.push('/questions/')
        }
      })
      .catch(error => {
          setError(ctxError('errors.server', error))
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

  const handleRulesChange = useCallback(rules => {
    setValue('rules', rules)
  }, [setValue])

  const handleFollowupQuestions = useCallback(questions => {
    setValue('followup', questions)
  }, [setValue])

  const handleName = useCallback(ev => {
    setValue(`name.${router.locale}`, ev.target.value)
  }, [setValue, router.locale])

  const handleCriteria = useCallback(val => {
    setValue('criteria', val)
  }, [setValue, router.locale])

  const handleNote = useCallback(val => {
    setValue(`note.${router.locale}`, val)
  }, [setValue, router.locale])

  return <form data-test-id="evaluation-question-form" onSubmit={handleSubmit(onSubmit, handleSubmitFailure)} className={classNames(styles['evaluation-question-form'], className)}>
    {error && <Alert type="error">{error.message}</Alert>}

    <div className={styles['evaluation-question-form-wrapper']}>
      <h2 className={styles['evaluation-question-form-title']}>{question ? t(`text.${type}-question.edit`) : t(`text.${type}-question.create`)}</h2>
      {!question ? <p className={styles['evaluation-question-form-desc']}>{t(`text.${type}.desc`)}</p> : null}

      {
        EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(type) == -1 ?
        <CriteriaOptionInputField id="note" error={isSubmitted && errors && errors['criteria']} value={formValues.criteria} type={type} onChange={handleCriteria} className={styles['evaluation-question-form-input-field']} /> :
        null
      }
      <TextInputField diff={locale} value={formValues.name[locale]}  error={isSubmitted && errors && errors.name && errors.name[locale]} autoComplete="off" name={`name.${locale}`} onChange={handleName} label={t("labels.question")} placeholder={t("placeholders.question-here")} className={styles['evaluation-question-form-input-field']} />
      <HtmlInputField id="note" value={formValues.note[locale]} diff={locale} error={isSubmitted && errors && errors.note && errors.note[locale]} name={`note.${locale}`} onChange={handleNote} label={t("labels.note")} placeholder={t("labels.notes-interviewer")} className={styles['evaluation-question-form-input-field']} />
      <FollowupQuestionForm values={formValues.followup} onValues={handleFollowupQuestions} className={styles['evaluation-question-form-input-field']} />
    </div>

    <QuestionScoreInputField className={styles['evaluation-question-form-input-field']} rules={formValues.rules} onChange={handleRulesChange}  />

    <PlatformButton disabled={loading} className={styles['evaluation-question-form-submit']} type="submit">
      {!loading ?  (question ? t('actions.save.question') : t('actions.add.question')) : t('status.loading')}
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default EvaluationQuestionForm;
