import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';
import { saveInterview } from 'libs/firestore';
import useForm from 'libs/use-form';
import { useState, useEffect} from 'react';
import BrandishButton from 'components/Button/BrandishButton';
import CandidateCard from 'components/CandidateCard/CandidateCard';
import { addFlash} from 'libs/flash';
import StageInterviewForm from 'components/StageInterviewForm/StageInterviewForm';
import styles from './interview-form.module.scss';

const defaultValues = {

}

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

    const stages = Object.values(values)

    //Evaluation scores
    let score = 0;
    let total = 0;

    for (let s = 0; s < stages.length; s++) {
      const evaluations = Object.values(stages[s])

      for (let i = 0; i < evaluations.length; i++) {
        if (typeof evaluations[i].score !== "undefined") {
          let maxScore = evaluations[i].score;

          if (evaluations[i].maxScore) {
            maxScore = evaluations[i].maxScore;
          }

          score += Math.round(evaluations[i].score / maxScore);

          total++;
        }
      }
    }

    interview.score = Math.round(score * 100 / total);

    saveInterview(interview)
      .then(() => {
        addFlash('Interview complete')

        router.push(`/projects/${project.id}/overview`)
      })
      .catch(setError)
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
      {stages.map((stage, index) => (
        <StageInterviewForm
          onValues={control.input(stage.id, false)}
          values={values[stage.id]}
          className={styles['interview-form-stage']}
          key={stage.id}
          stage={stage}
          index={index}
          last={index == stages.length - 1}
          nextId={index < stages.length - 1 ? `feature-form-${stages[index+1].id}` : null}
          project={project} />
      ))}
    </div>
    <p style={{textAlign: 'center'}}>
      <BrandishButton className={styles['interview-form-submit']}>{!loading ? 'Complete interview' : 'Loading...'}</BrandishButton>
    </p>

    {loading ? <Preloader /> : null}
  </form>
}

export default InterviewForm;
