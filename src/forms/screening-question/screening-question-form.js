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

export const getScreeningQuestionLabelBySubtype = (subtype) => {
  if (subtype == 'range') {
    return <IconicLabel Icon={BoxesIcon}>Range</IconicLabel>;
  }

  if (subtype == 'text') {
    return <IconicLabel Icon={TextIcon}>Text</IconicLabel>;
  }

  return subtype == 'choice' ?
    <IconicLabel Icon={DoubleCheckIcon}>Yes/No</IconicLabel> :
    <IconicLabel Icon={MultichoiceIcon}>Multiple choice</IconicLabel>;
}


const ScreeningQuestionForm = ({ className, question }) => {
  const [subtype, setSubtype] = useState(null);
  const [FormComponent, setFormComponent] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const { user } = useUser();

  const handleQuestion = (values) => {
    values.type = 'screening';

    //Returning type may differ
    const subT = values.id ? values.subtype : subtype;

    if (subT == 'choice' || subT == 'multichoice') {
      values.subtype = values.multichoice ? 'multichoice' : 'choice';
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

  return <div data-test-id="screening-question-form" className={classNames(styles['screening-question-form'], className)}>
    {
      !question ?
      <h1 className={styles['screening-question-form-title']}>Create a screening question {subtype ? <small>({getScreeningQuestionLabelBySubtype(subtype)})</small> : null}</h1> :
      <h1 className={styles['screening-question-form-title']}>Edit screening question <small>({getScreeningQuestionLabelBySubtype(question.subtype)})</small></h1>
    }

    {
      !question && !subtype ?
      <ul  data-test-id="screening-question-options" className={styles['screening-question-form-options']}>
        <li onClick={() => setSubtype('choice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('choice')}</li>
        <li onClick={() => setSubtype('multichoice')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('multichoice')}</li>
        <li onClick={() => setSubtype('range')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('range')}</li>
        <li onClick={() => setSubtype('text')} className={styles['screening-question-form-options-option']}>{getScreeningQuestionLabelBySubtype('text')}</li>
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