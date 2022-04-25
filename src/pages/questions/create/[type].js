import { criteriaTypes } from 'libs/criteria';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { useRouter } from 'next/router';
import Head from 'next/head'
import ScreeningQuestionForm from 'forms/screening-question/screening-question-form';
import OtherQuestionForm from 'forms/other-question/other-question-form';
import EvaluationQuestionForm from 'forms/question/question-form';

import styles from 'styles/pages/question-create.module.scss';

const QuestionCreatePage = ({ criteria }) => {
  const router = useRouter();

  return <div className={styles['question-create-page']}>
    <Head>
      <title>Create a new {(criteria.altName || criteria.name).toLowerCase()} question  - Asker</title>
    </Head>

    { criteria.id == 'screening' ? <ScreeningQuestionForm className={styles['question-create-page-form']} /> : null}
    { criteria.id == 'other' ? <OtherQuestionForm className={styles['question-create-page-form']} /> : null}
    { criteria.id == 'evaluation' ? <EvaluationQuestionForm className={styles['question-create-page-form']} criteria={criteria} /> : null}
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
