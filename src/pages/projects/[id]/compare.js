import { getSettings } from 'libs/firestore-admin';
import { useState, useMemo } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getSingleDocument, filterManyDocuments } from 'libs/firestore-admin'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { unpackQuestions } from 'libs/project';
import BackIcon from 'components/Icon/BackIcon';
import ProjectInterviewCompare from 'components/ProjectInterviewCompare/ProjectInterviewCompare';
import { useEffect } from 'react';
import {useModal} from 'libs/modal';

import styles from 'styles/pages/project-compare.module.scss';
import CandidateChooseModal from 'modals/candidate-choose/candidate-choose-modal';
// import CompareBox from 'components/CompareBox/CompareBox';

const defaultSort = [
  ['status', 'desc'], // complete, awaiting
  ['createdAt', 'desc']
]

const scoreSort = function(ca, cb) {
  if (ca.score < cb.score) return 1;
  if (ca.score > cb.score) return -1;

  if (ca.candidate.name < cb.candidate.name) return -1;
  if (ca.candidate.name > cb.candidate.name) return 1;

  return 0;
}

const ProjectComparePage = ({ project, interviews = [] }) => {
  const router = useRouter();
  const [compare, setCompare] = useState([])

  const completeInterviews = useMemo(
    () => interviews.filter(i => i.status == 'complete'),
    [interviews]
  ); 

  useEffect(() => {
    const parts = router.query.interviews.split('|');
    const compare = parts.map(cid => interviews.find(i => i.id == cid)).filter(c => c)

    compare.sort(scoreSort)

    setCompare(compare)
  }, [interviews])

  const removeCompareInterview = interview => {
    setCompare([
      ...compare.filter(c => c != interview)
    ])
  }

  const openChooseCandidateModal = useModal(CandidateChooseModal)

  return <div className={styles['project-compare-page']}>
      <Head>
        <title>{project.name} - Candidate compare - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles['project-compare-page-head']}>
        <Link href={`/projects/${project.id}/overview`}>
            <a className={styles['project-compare-page-back']}><BackIcon /></a>
        </Link>

        <h1 className={styles['project-compare-page-title']}>{project.name}</h1>
      </div>

      <ProjectInterviewCompare
        compare={compare}
        interviews={completeInterviews}
        onCompareRemove={removeCompareInterview}
        project={project}
        onCompareAdd={() => openChooseCandidateModal(
          compare => compare && setCompare(compare),
          {
            formProps: {
              interviews: completeInterviews, values: [...compare] 
            }
          }
        )}
        className={styles['project-compare-page-table']} />
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

export default ProjectComparePage;
