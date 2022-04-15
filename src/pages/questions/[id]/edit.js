import { criteriaTypes } from 'libs/criteria';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { useRouter } from 'next/router';
import QuestionForm from 'forms/question/question-form';
import { getSingleDocument } from 'libs/firestore-admin';
import Head from 'next/head';

import styles from 'styles/pages/question-edit.module.scss';

const QuestionEditPage = ({ question }) => {
  const router = useRouter();

  return <div className={styles['question-edit-page']}>
    <Head>
      <title>{question.name} - {question.companyId === 'asker' ? 'Clone' : 'Edit'} question - Asker</title>
    </Head>
    <QuestionForm question={question} className={styles['question-edit-page-form']} criteria={criteriaTypes.find(c => c.id == question.criteria.type)} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const filter = [
    ['id', '==', query.id],
    ['companyId', '==', req.session.user.companyId]
  ];

  const question = await getSingleDocument('questions', filter)

  if (!question) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config: await getSettings(),
      question
    }
  }
})

export default QuestionEditPage;
