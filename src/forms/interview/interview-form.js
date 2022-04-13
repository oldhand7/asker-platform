import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';
import { saveInterview } from 'libs/firestore';
import useForm from 'libs/use-form';
import { useState, useEffect} from 'react';
import PlatformButton from 'components/Button/PlatformButton';
import CandidateCard from 'components/CandidateCard/CandidateCard';
import { addFlash} from 'libs/flash';

import styles from './interview-form.module.scss';

const defaultValues = {}

const rules = {}

const InterviewForm = ({ className, interview, project }) => {
  const [values, errors, control] = useForm({
    values: defaultValues,
    rules
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (values) => {
    setLoading(true);

    interview.evaluations = values;
    interview.status = 'complete'

    //@TODO: score

    saveInterview(interview)
      .then(() => {
        addFlash('Interview complete')

        router.push(`/projects/${project.id}`)
      })
      .catch(setError)
  }

  return <form className={classNames(styles['interview-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <h2 className={styles['interview-form-title']}>Interview with</h2>

    <CandidateCard className={styles['interview-form-candidate-card']} candidate={interview.candidate} />

    {error ? <Alert type="error">{error.message}</Alert> : null}

    {/* @TODO */}

    <PlatformButton className={styles['interview-form-submit']}>{!loading ? 'Complete Interview' : 'Loading...'}</PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default InterviewForm;
