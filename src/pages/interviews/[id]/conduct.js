import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getSingleDocument, filterSingleDocument } from 'libs/firestore-admin'
import InterviewForm from 'forms/interview/interview-form'

import styles from 'styles/pages/interview-conduct.module.scss';

const InterviewConductPage = ({ interview, project }) => {
  return <div className={styles['interview-conduct-page']}>
      <Head>
        <title>{interview.candidate.name} - {project.name} - Conduct interview - Asker</title>
      </Head>

      <InterviewForm interview={interview} project={project} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
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

  return {
    props: {
      interview: JSON.parse(JSON.stringify(interview)),
      project,
      config: await getSettings()
    }
  }
})

export default InterviewConductPage;
