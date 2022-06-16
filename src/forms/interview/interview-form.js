import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';
import { saveCollectionDocument } from 'libs/firestore';
import useForm from 'libs/use-form';
import { useState, useEffect} from 'react';
import BrandishButton from 'components/Button/BrandishButton';
import CandidateCard from 'components/CandidateCard/CandidateCard';
import { addFlash} from 'libs/flash';
import StageInterviewForm from 'components/StageInterviewForm/StageInterviewForm';
import styles from './interview-form.module.scss';
import { ctxError } from 'libs/helper';
import { calcInterviewScore } from 'libs/scoring';
import { getStageKey } from 'libs/stage';

const rules = {}

const InterviewForm = ({ className, interview, project }) => {
  const [values, errors, control] = useForm({
    values: interview.evaluations,
    rules
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [stages, setStages] = useState([]);

  const handleSubmit = (values) => {
    setLoading(true);

    interview.evaluations = values;
    interview.status = 'complete'
    interview.score = calcInterviewScore(interview, project)

    saveCollectionDocument('interviews', interview)
      .then(() => {
        addFlash('Interview complete')

        router.push(`/projects/${project.id}/overview`)
      })
      .catch(error => {
        setError(ctxError('Server error', error))
      })
  }

  useEffect(() => {
    setLoading(false);
  }, [error])

  useEffect(() => {
    setStages(project.stages.filter(s => s))
  }, [project])

  return <form className={classNames(styles['interview-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <h2 className={styles['interview-form-title']}>Interview with</h2>

    <CandidateCard className={styles['interview-form-candidate-card']} candidate={interview.candidate} />

    {error ? <Alert type="error">{error.message}</Alert> : null}

    <div className={styles['interview-form-stages']}>
      {stages.map((stage, index) => {
        const key = getStageKey(stage)

        return <StageInterviewForm
          onValues={control.input(key, false)}
          values={values[key]}
          className={styles['interview-form-stage']}
          key={key}
          id={key}
          stage={stage}
          index={index}
          last={index == stages.length - 1}
          nextId={index < stages.length - 1 ? `feature-form-${getStageKey(stages[index+1])}` : null}
          project={project} />
      })}
    </div>
    <p style={{textAlign: 'center'}}>
      <BrandishButton className={styles['interview-form-submit']}>{!loading ? 'Complete interview' : 'Loading...'}</BrandishButton>
    </p>

    {loading ? <Preloader /> : null}
  </form>
}

export default InterviewForm;
