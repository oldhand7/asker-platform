import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getSingleDocument, filterSingleDocument } from 'libs/firestore-admin'
import InterviewForm from 'forms/interview/interview-form'
import { unpackQuestions } from 'libs/project';
import BlankLayout from 'layouts/blank/blank-layout';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/interview-conduct.module.scss';

const InterviewConductPage = ({ interview, project }) => {
  const { t } = useTranslation();

  return <div className={styles['interview-conduct-page']}>
      <Head>
        <title>{interview.candidate.name} - {project.name} - {t('actions.conduct-interview')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <InterviewForm className={styles['interview-conduct-page-form']} interview={interview} project={project} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/interviews/${query.id}/conduct/`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  const interview = await getSingleDocument('interviews', query.id)

  if (!interview) {
    return {
      notFound: true
    }
  }

  const project =  await filterSingleDocument('projects', [
    ['id', '==', interview.projectId],
    ['companyId', '==',  req.session.user.companyId]
  ])

  unpackQuestions(project)

  return {
    props: {
      interview: JSON.parse(JSON.stringify(interview)),
      project: JSON.parse(JSON.stringify(project)),
      config: await getSettings()
    }
  }
})

InterviewConductPage.layout = BlankLayout

export default InterviewConductPage;
