import { criteriaTypes } from 'libs/criteria';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { useRouter } from 'next/router';
import QuestionForm from 'forms/question/question-form';
import Head from 'next/head'

import styles from 'styles/pages/question-create.module.scss';

const QuestionCreatePage = ({ criteria }) => {
  const router = useRouter();

  return <div className={styles['question-create-page']}>
    <Head>
      <title>Create {criteria.name.toLowerCase()} question - Asker</title>
    </Head>
    <QuestionForm className={styles['question-create-page-form']} criteria={criteria} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const criteria = criteriaTypes.find(c => c.id == query.type);

  if (!criteria) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config: await getSettings(),
      criteria
    }
  }
})

export default QuestionCreatePage;
