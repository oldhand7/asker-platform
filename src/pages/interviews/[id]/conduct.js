import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect, useState } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import { getCompanyProject, getCompanyInterview } from 'libs/firestore-admin'
import UserCard from 'components/UserCard/UserCard'
import InterviewForm from 'forms/interview/interview-form'
import styles from 'styles/pages/interview-conduct.module.scss';

const InterviewConductPage = ({ interview, project }) => {
  const [user] = useUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return <div className={styles['interview-conduct-page']}>
      <Head>
        <title>{interview.candidate.name} - {project.name} - Conduct interview - Asker</title>
      </Head>

      <InterviewForm interview={interview} project={project} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const interview = await getCompanyInterview(req.session.user.companyId, query.id);

  if (!interview) {
    return {
      notFound: true
    }
  }

  const project =  await getCompanyProject(req.session.user.companyId, interview.projectId)

  return {
    props: {
      interview,
      project,
      config: await getSettings()
    }
  }
})

export default InterviewConductPage;
