import { questionTypes } from 'libs/questions';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { useRouter } from 'next/router';
import Head from 'next/head'
import ScreeningQuestionForm from 'forms/screening-question/screening-question-form';
import OtherQuestionForm from 'forms/other-question/other-question-form';
import EvaluationQuestionForm from 'forms/evaluation-question/evaluation-question-form';

import styles from 'styles/pages/question-create.module.scss';

const QuestionCreatePage = ({ questionType, questionSubtype }) => {
  const router = useRouter();

  return <div className={styles['question-create-page']}>
    <Head>
      <title>Create a new {((questionSubtype || questionType).altName || (questionSubtype || questionType).name).toLowerCase()} question  - Asker</title>
    </Head>

    { questionType.id == 'screening' ? <ScreeningQuestionForm className={styles['question-create-page-form']} /> : null}
    { questionType.id == 'other' ? <OtherQuestionForm className={styles['question-create-page-form']} /> : null}
    { questionType.id == 'evaluation' ? <EvaluationQuestionForm className={styles['question-create-page-form']} subtype={questionSubtype || questionType.subtypes[0]} /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const questionType = questionTypes.find(c => c.id == query.type);

  let questionSubtype = null;

  if (query.subtype) {
    questionSubtype = questionType.subtypes.find(sub => sub.id == query.subtype)

    if (!questionSubtype) {
      return {
        notFound: true
      }
    }
  }

  return {
    props: {
      config: await getSettings(),
      questionType,
      questionSubtype: questionSubtype
    }
  }
})

export default QuestionCreatePage;
