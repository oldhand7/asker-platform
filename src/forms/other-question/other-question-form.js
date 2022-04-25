import classNames from 'classnames';
import TextQuestion from 'forms/text-question/text-question-form';
import { addFlash } from 'libs/flash';
import { saveCollectionDocument } from 'libs/firestore';
import { useState, useEffect } from 'react';
import { useUser } from 'libs/user';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';

import styles from './other-question-form.module.scss';

const OtherQuestionForm = ({ className, question }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleQuestion = values => {
    if (!values.type) {
      values.type = 'other';
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

  return <div className={classNames(styles['other-question-form'])}>
    {
      !question ?
      <h1 className={styles['other-question-form-title']}>Create question</h1> :
      <h1 className={styles['other-question-form-title']}>Edit question</h1>
    }

    {error ? <Alert type="danger">{error.message}</Alert> : null}

    <TextQuestion onCancel={() => router.push('/questions/')} className={classNames(styles['other-question-form-subform'])} loading={loading} values={question || {}} onValues={handleQuestion} />
    {loading ? <Preloader /> : null}
  </div>
}

export default OtherQuestionForm;
