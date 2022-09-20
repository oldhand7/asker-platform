import dynamic from 'next/dynamic'
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import IconicLabel from 'components/IconicLabel/IconicLabel';
import { saveCollectionDocument } from 'libs/firestore';
import { addFlash } from 'libs/flash';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import { useUser } from 'libs/user';
import Preloader from 'components/Preloader/Preloader';
import MultichoiceIcon from 'components/Icon/MultichoiceIcon';
import RangeIcon from 'components/Icon/RangeIcon';
import TextIcon from 'components/Icon/TextIcon';
import { ctxError }from 'libs/helper';
import YesNoIcon from 'components/Icon/YesNoIcon';
import { useTranslation } from 'libs/translation';

import styles from './screening-question-form.module.scss';

const featureForms = {
  'choice': dynamic(() => import('forms/choice-question/choice-question-form')),
  'multichoice': dynamic(() => import('forms/choice-question/choice-question-form')),
  'range': dynamic(() => import('forms/range-question/range-question-form')),
  'text': dynamic(() => import('forms/text-question/text-question-form'))
}

export const getScreeningQuestionLabelBySubtype = (subtype, t) => {
  if (subtype == 'range') {
    return <IconicLabel Icon={RangeIcon}>{t('labels.range')}</IconicLabel>;
  }

  if (subtype == 'text') {
    return <IconicLabel Icon={TextIcon}>{t('labels.text')}</IconicLabel>;
  }

  return subtype == 'choice' ?
    <IconicLabel Icon={YesNoIcon}>{t('labels.yes-no')}</IconicLabel> :
    <IconicLabel Icon={MultichoiceIcon}>{t('labels.multiple-choice')}</IconicLabel>;
}


const ScreeningQuestionForm = ({ className, question, type = 'screening', onValues }) => {
  const [subtype, setSubtype] = useState(question && question.subtype);
  const [FormComponent, setFormComponent] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const { user } = useUser();
  const { t } = useTranslation();

  const handleQuestion = (values) => {
    values.type = type;

    //Returning type may differ
    const subT = values.id ? values.subtype : subtype;

    if (subT == 'choice' || subT == 'multichoice') {
      values.subtype = values.multichoice ? 'multichoice' : 'choice';
    } else {
      values.subtype = subT
    }

    setLoading(true)

    let clone = question && question.companyId == 'asker' && user.companyId != 'asker';

    if (clone) {
      delete values.id;
    }

    values.companyId = user.companyId
    values.userId = user.id;

    saveCollectionDocument('questions', values)
      .then(id => {
        if (onValues) {
          onValues({
            ...values,
            id
          })
        } else {
          if (question) {
            addFlash(t('status.question-saved'), 'success')
          } else {
            addFlash(t('status.question-created'), 'success')
          }

          router.push('/questions/')
        }
      })
      .catch(error => {
        setError(ctxError(t('errors.server'), error))
      })
  }

  useEffect(() => {
    if (!question && subtype && featureForms[subtype]) {
      setFormComponent(featureForms[subtype])
    } else if (question && featureForms[question.subtype]) {
      setFormComponent(featureForms[question.subtype])
    } else {
      setFormComponent(null)
    }
  }, [question, subtype])

  useEffect(() => {
    setLoading(false);
  }, [error])

  return <div data-test-id={`${type}-question-form`} className={classNames(styles['screening-question-form'], className)}>
    {
      !question ?
      <h2 data-test-id="title" className={styles['screening-question-form-title']}>
        {type == 'screening' ? 'Create a screening question' : t('actions.create-other-question')}
        {subtype ? <small>({getScreeningQuestionLabelBySubtype(subtype, t)})</small> : null}</h2> :
      <h2 data-test-id="title" className={styles['screening-question-form-title']}>
        {type == 'screening' ? t('actions.edit-screening-question') : t('actions.edit-other-question')}
        <small>({getScreeningQuestionLabelBySubtype(question.subtype, t)})</small>
      </h2>
    }

    {
      !question && !subtype ?
      <ul  data-test-id={`${type}-question-options`} className={styles['screening-question-form-options']}>
        {
          type == 'screening' ?
          <>
            <li onClick={() => setSubtype('choice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('choice', t)}</li>
            <li onClick={() => setSubtype('multichoice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('multichoice', t)}</li>
            <li onClick={() => setSubtype('range')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('range', t)}</li>
          </> :
          <>
            <li onClick={() => setSubtype('text')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('text', t)}</li>
          </>
        }
      </ul> :
      null
    }

    {error ? <Alert type="danger">{error.message}</Alert> : null}

    {
      FormComponent ?
      <FormComponent
        className={styles['screening-question-form-subform']}
        onValues={handleQuestion}
        values={question}
        onCancel={() => !question && setSubtype(null)}
        loading={loading}
        multichoice={subtype == 'multichoice'}
        /> :
      null
    }
    {loading ? <Preloader /> : null}
  </div>
}

export default ScreeningQuestionForm;
