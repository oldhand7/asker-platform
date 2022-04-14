import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getCompanyProject, getProjectInterviews } from 'libs/firestore-admin'
import PlatformButton from 'components/Button/PlatformButton';
import Preloader from 'components/Preloader/Preloader';
import ProjectInterviewsTable from 'components/ProjectInterviewsTable/ProjectInterviewsTable'
import CandidateModal from 'modals/candidate/candidate-modal';
import { useModal } from 'libs/modal';
import PlusIcon from 'components/Icon/PlusIcon';
import { useRouter } from 'next/router';
import Alert from 'components/Alert/Alert';
import { saveInterview } from 'libs/firestore'
import Link from 'next/link';
import { useFlash } from 'libs/flash'

import styles from 'styles/pages/project-overview.module.scss';

const ProjectOverviewPage = ({ project, interviews = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const openCandidateModal = useModal(CandidateModal, 'large');
  const [_interviews, setInterviews] = useState(interviews);
  const [error, setError] = useState(null);
  const success = useFlash('success');

  const handleCandidate = (values) => {
    if (!values) return;

    setLoading(true);

    const interview = {
      projectId: router.query.id,
      companyId: project.companyId,
      candidate: values,
      status: 'awaiting'
    }

    saveInterview(interview).then(interviewId => {
      interview.id = interviewId

      setInterviews([
        interview,
        ..._interviews
      ])

      setLoading(false);
    })
    .catch(setError)
  }

  useEffect(() => {
    setLoading(false);
  }, [error])

  return <div className={styles['project-overview-page']}>
      <Head>
        <title>{project.name} - Project overview - Asker</title>
      </Head>

      <div className={styles['project-overview-page-overview']}>
        <h1 className={styles['project-overview-page-title']}>{project.name} <Link href={`/projects/${project.id}/edit`}><a className={styles['project-overview-page-title-edit-link']}>edit</a></Link></h1>

        {success ? <Alert type="success">{success}</Alert> : null}

        {/*<ProjectEvaluationCriteria className={styles['project-overview-page-evaluation-criteria']} />*/}

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
        <ProjectInterviewsTable className={styles['project-overview-page-interviews-table']} data={_interviews} />
      </div>
      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const project = await getCompanyProject(req.session.user.companyId, query.id);

  if (!project) {
    return {
      notFound: true
    }
  }

  const interviews = await getProjectInterviews(query.id);

  return {
    props: {
      project,
      interviews,
      config: await getSettings()
    }
  }
})

export default ProjectOverviewPage;
