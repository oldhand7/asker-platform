import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState, useMemo } from 'react';
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
import { unpackQuestions } from 'libs/project';
import { getRandomAlias } from 'libs/candidate';
import ProjectAnonimizeToggle from 'components/ProjectAnonimizeToggle/ProjectAnonimizeToggle';
import CompareBox from 'components/CompareBox/CompareBox';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/project-overview.module.scss';

const defaultSort = [
  ['status', 'desc'],
  ['score', 'desc'],
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
  const [compare, setCompare] = useState([])
  const [_project, setProject] = useState(project);
  const { t } = useTranslation();

  useEffect(() => {
    if (flashSuccess) {
      setSuccess(flashSuccess)
    }
  }, [flashSuccess])


  const handleCandidate = (values) => {
    if (!values) return;

    setLoading(true);

    const interview = {
      projectId: router.query.id,
      companyId: project.companyId,
      candidate: values,
      status: 'awaiting',
      score: 0
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
      setError(ctxError('errors.server', error))
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
      if (!confirm(t('actions.confirm'))) {
        return;
      }

      setLoading(true);

      deleteSingle('interviews', interview.id)
        .then(() => {
          setInterviews(_interviews.filter(i => i.id != interview.id))
          setLoading(false);
          setSuccess('status.interview-deleted')
        })
        .catch(error => {
          setError(ctxError('errors.server', error))
        })
  }

  const handleCompareInterview = (interview) => {
    if (compare.indexOf(interview) > -1) {
      setCompare([
        ...compare.filter(c => c != interview)
      ])
    } else {
      setCompare([
        ...compare,
        interview
      ])
    }
  }

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null)
      }, 7000)
    }
  }, [success])

  const complateInterviews = useMemo(
    () => _interviews.filter(i => i.status == 'complete'),
    [_interviews]
  );

  const handleCandidateEdit = (interview) => {
    const { candidate } = interview;

    openCandidateModal((candidate) => {
      if (!candidate) return;

      setLoading(true);

      interview.candidate = candidate

      saveCollectionDocument('interviews', {...interview})
        .then(() => {
          setInterviews([...interviews])
          setLoading(false);
        })
        .catch(() => {
          setError(new Error("Saving candidate failed."))
          setLoading(false);
        })
    }, { candidate })
  }


  return <div className={styles['project-overview-page']}>
      <Head>
        <title>{project.name} - {t('headings.project-overview')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles['project-overview-page-overview']}>
        <div className={styles['project-overview-page-overview-head']}>
          <h1 className={styles['project-overview-page-title']}>
            {project.name} <Link href={`/projects/${project.id}/edit`}>
              <a className={styles['project-overview-page-title-edit-link']}>{t('actions.edit')}</a></Link>
          </h1>
          <div>
          <PlatformButton onClick={() => openCandidateModal(handleCandidate, {alias: getRandomAlias(_interviews.map(i => i.candidate.alias))})} className={styles['project-overview-page-add-candidate']}>
            <PlusIcon /> {t('actions.add-candidate')}</PlatformButton>
          </div>
        </div>

        {success ? <Alert type="success">{success}</Alert> : null}
        {error ? <Alert type="error">{error.message}</Alert> : null}

        <ProjectInterviewsTable
          project={_project}
          onEditCandidate={handleCandidateEdit}
          onDelete={handleDeleteInterview}
          className={styles['project-overview-page-interviews-table']}
          data={_interviews}
          emptyLabel={t('status.no-candidates')}
          onCompare={handleCompareInterview}
          compare={compare}
          />
      </div>

      <div className={styles['project-overview-page-sidebar']}>
        <ProjectAnonimizeToggle className={styles["project-overview-page-anonimizaiton"]} project={_project} onChange={p => setProject({ ...p })} />

        <ProjectEvaluationCriteria className={styles['project-overview-page-evaluation-criteria']} project={project} />

        <div data-test-id="interviewers" className={styles['project-overview-page-interviewers']}>
          <h2 className={styles['project-overview-page-interviewers-title']}>{t('headings.interviewers')}</h2>
          <ul className={styles['project-overview-page-interviewers-list']}>
            {project.interviewers.map(interviewer => <li className={styles['project-overview-page-interviewers-list-item']} key={interviewer.id}>{interviewer.name}</li>)}
          </ul>
        </div>
      </div>

      <CompareBox
        onCompare={handleCompareInterview}
        onCompareAll={() => {
         if (compare.length == complateInterviews.length) {
          setCompare([])
         } else {
          setCompare([...complateInterviews])
         }
        }}
        compare={compare}
        interviews={complateInterviews}
        className={styles['project-overview-page-compare']}
        project={_project}
        />

      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/projects/${query.id}/overview`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  const project = await getSingleDocument('projects', query.id)

  if (!project) {
    return {
      notFound: true
    }
  }

  unpackQuestions(project)

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
