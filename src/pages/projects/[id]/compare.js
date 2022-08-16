import { getSettings, getTranslations } from 'libs/firestore-admin';
import { useState, useMemo } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getSingleDocument, filterManyDocuments } from 'libs/firestore-admin'
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { unpackQuestions } from 'libs/project';
import BackIcon from 'components/Icon/BackIcon';
import ProjectInterviewCompare from 'components/ProjectInterviewCompare2/ProjectInterviewCompare';
import { useEffect } from 'react';
import {useModal} from 'libs/modal';
import { scoreSort, buildSearchQuery } from 'libs/helper';
import { useSite } from 'libs/site';
import ProjectAnonimizeToggle from 'components/ProjectAnonimizeToggle/ProjectAnonimizeToggle';
import styles from 'styles/pages/project-compare.module.scss';
import CandidateChooseModal from 'modals/candidate-choose/candidate-choose-modal';
// import CompareBox from 'components/CompareBox/CompareBox';

const defaultSort = [
  ['status', 'desc'], // complete, awaiting
  ['createdAt', 'desc']
]

const ProjectComparePage = ({ project, interviews = [] }) => {
  const router = useRouter();
  const [compare, setCompare] = useState([])
  const { t } = useSite();
  const [_project, setProject] = useState(project);

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


  useEffect(() => {
    const { pathname } = window.location;

    const query = {
      interviews: compare.map(c => c.id).join('|')
    }

    router.push(`${pathname}?${buildSearchQuery(query)}`, null, { shallow: true })
  }, [compare])

  return <div className={styles['project-compare-page']}>
      <Head>
        <title>{project.name} - {t('Candidate compare')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles['project-compare-page-head']}>
        <Link href={`/projects/${_project.id}/overview`}>
            <a className={styles['project-compare-page-back']}>
              <BackIcon className={styles['project-compare-page-back-icon']} />
              <span className={styles['project-compare-page-back-text']}>{t('Back')}</span>
            </a>
        </Link>

        <h1 className={styles['project-compare-page-title']}>{_project.name}</h1>

        <ProjectAnonimizeToggle project={_project} onChange={p => setProject({...p})} className={styles['project-compare-page-anonimize']} />
      </div>

      <ProjectInterviewCompare
        compare={compare}
        interviews={completeInterviews}
        onCompareRemove={removeCompareInterview}
        project={_project}
        onCompare={setCompare}
        onCompareAdd={() => openChooseCandidateModal(
          compare => compare && setCompare(compare),
          {
            formProps: {
              interviews: completeInterviews, values: [...compare],
              anonimize: _project.anonimize
            }
          }
        )}
        className={styles['project-compare-page-table']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/projects/${query.id}/compare/?interviews=${query.interviews}`;

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
      config: await getSettings(),
      translations: await getTranslations()
    }
  }
})

export default ProjectComparePage;
