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
import BoxesIcon from 'components/Icon/BoxesIcon';
import DoubleCheckIcon from 'components/Icon/DoubleCheckIcon';
import TextIcon from 'components/Icon/TextIcon';

import styles from './screening-question-form.module.scss';

const featureForms = {
  'choice': dynamic(() => import('forms/choice-question/choice-question-form')),
  'multichoice': dynamic(() => import('forms/choice-question/choice-question-form')),
  'range': dynamic(() => import('forms/range-question/range-question-form')),
  'text': dynamic(() => import('forms/text-question/text-question-form'))
}

const ScreeningQuestionForm = ({ className, question }) => {
  const [type, setType] = useState(null);
  const [FormComponent, setFormComponent] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const { user } = useUser();

  const getScreeningQuestionLabelByType = (type) => {
    if (type == 'range') {
      return <IconicLabel Icon={BoxesIcon}>Range</IconicLabel>;
    }

    if (type == 'text') {
      return <IconicLabel Icon={TextIcon}>Text</IconicLabel>;
    }

    return type == 'choice' ?
      <IconicLabel Icon={DoubleCheckIcon}>Yes/No</IconicLabel> :
      <IconicLabel Icon={MultichoiceIcon}>Multiple choice</IconicLabel>;
  }

  const handleQuestion = (values) => {
    if (!values.type) {
      values.type = type;
    }

    setLoading(true)

    let clone = question && question.companyId == 'asker';

    if (clone) {
      delete values.id;
    }

    values.companyId = user.companyId
    values.userId = user.id;

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

  useEffect(() => {
    if (!question && type && featureForms[type]) {
      setFormComponent(featureForms[type])
    } else if (question && featureForms[type]) {
      setFormComponent(featureForms[question.type])
    } else {
      setFormComponent(null)
    }
  }, [question, type])

  useEffect(() => {
    setLoading(false);
  }, [error])

  return <div className={classNames(styles['screening-question-form'], className)}>
    {
      !question ?
      <h1 className={styles['screening-question-form-title']}>Create a screening question {type ? <span>({getScreeningQuestionLabelByType(type)})</span> : null}</h1> :
      <h1 className={styles['screening-question-form-title']}>Edit a screening question <span>({getScreeningQuestionLabelByType(question.type)})</span></h1>
    }

    {
      !question && !type ?
      <ul className={styles['screening-question-form-options']}>
        <li onClick={() => setType('choice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelByType('choice')}</li>
        <li onClick={() => setType('multichoice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelByType('multichoice')}</li>
        <li onClick={() => setType('range')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelByType('range')}</li>
        <li onClick={() => setType('text')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelByType('text')}</li>
      </ul> :
      null
    }

    {error ? <Alert type="danger">{error.message}</Alert> : null}

    {
      FormComponent ?
      <FormComponent
        className={styles['screening-question-form-subform']}
        onValues={handleQuestion}
        values={question || {}}
        onCancel={() => !question && setType(null)}
        loading={loading}
        type={type}
        /> :
      null
    }
    {loading ? <Preloader /> : null}
  </div>
}

export default ScreeningQuestionForm;
