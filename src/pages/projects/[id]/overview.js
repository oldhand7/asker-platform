import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getSingleDocument, filterManyDocuments } from 'libs/firestore-admin'
import PlatformButton from 'components/Button/PlatformButton';
import Preloader from 'components/Preloader/Preloader';
import ProjectInterviewsTable from 'components/ProjectInterviewsTable/ProjectInterviewsTable'
import CandidateModal from 'modals/candidate/candidate-modal';
import { useModal } from 'libs/modal';
import PlusIcon from 'components/Icon/PlusIcon';
import { useRouter } from 'next/router';
import Alert from 'components/Alert/Alert';
import { saveCollectionDocument, deleteSingle } from 'libs/firestore'
import Link from 'next/link';
import { useFlash } from 'libs/flash'
import ProjectEvaluationCriteria from 'components/ProjectEvaluationCriteria/ProjectEvaluationCriteria';
import { ctxError } from 'libs/helper';

import styles from 'styles/pages/project-overview.module.scss';

const defaultSort = [
  ['status', 'desc'], // complete, awaiting
  ['createdAt', 'desc']
]

const ProjectOverviewPage = ({ project, interviews = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const openCandidateModal = useModal(CandidateModal, { size: 'large' });
  const [_interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const flashSuccess = useFlash('success');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (flashSuccess) {
      setSuccess(flashSuccess)
    }
  }, flashSuccess)

  const handleCandidate = (values) => {
    if (!values) return;

    setLoading(true);

    const interview = {
      projectId: router.query.id,
      companyId: project.companyId,
      candidate: values,
      status: 'awaiting'
    }

    saveCollectionDocument('interviews', interview)
    .then(interviewId => {
      interview.id = interviewId

      setInterviews([
        interview,
        ..._interviews
      ])

      setLoading(false);
    })
    .catch(error => {
      setError(ctxError('Server error', error))
    })
  }

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error])

  useEffect(() => {
    setInterviews(interviews)
  }, [interviews])

  const handleDeleteInterview = (interview) => {
      if (!confirm('Are you sure?')) {
        return;
      }

      setLoading(true);

      deleteSingle('interviews', interview.id)
        .then(() => {
          setInterviews(_interviews.filter(i => i.id != interview.id))
          setLoading(false);
          setSuccess('Interview deleted')
        })
        .catch(error => {
          setError(ctxError('Server error', error))
        })
  }

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null)
      }, 7000)
    }
  }, [success])

  return <div className={styles['project-overview-page']}>
      <Head>
        <title>{project.name} - Project overview - Asker</title>
      </Head>

      <div className={styles['project-overview-page-overview']}>
        <h1 className={styles['project-overview-page-title']}>{project.name} <Link href={`/projects/${project.id}/edit`}><a className={styles['project-overview-page-title-edit-link']}>edit</a></Link></h1>

        {success ? <Alert type="success">{success}</Alert> : null}

        <ProjectEvaluationCriteria className={styles['project-overview-page-evaluation-criteria']} project={project} />

        <div data-test-id="interviewers" className={styles['project-overview-page-interviewers']}>
          <h2 className={styles['project-overview-page-interviewers-title']}>Assigned Interviewer</h2>
          <ul className={styles['project-overview-page-interviewers-list']}>
            {project.interviewers.map(interviewer => <li className={styles['project-overview-page-interviewers-list-item']} key={interviewer.id}>{interviewer.name}</li>)}
          </ul>
        </div>
      </div>

      {error ? <Alert type="error">{error.message}</Alert> : null}

      <div className={styles['project-overview-page-interviews']}>
        <PlatformButton onClick={() => openCandidateModal(handleCandidate)} className={styles['project-overview-page-interviews-add-candidate']}><PlusIcon /> Add candidate</PlatformButton>
        <ProjectInterviewsTable project={project} onDelete={handleDeleteInterview} className={styles['project-overview-page-interviews-table']} data={_interviews} />
      </div>
      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const project = await getSingleDocument('projects', query.id)

  if (!project) {
    return {
      notFound: true
    }
  }

  const interviews = await filterManyDocuments('interviews',
    [
      ['projectId', '==', project.id]
    ],
    query.sort ? [
      [query.sort, query.order || 'asc']
    ] : defaultSort
  )

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
      interviews,
      config: await getSettings()
    }
  }
})

export default ProjectOverviewPage;
