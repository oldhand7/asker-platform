import { questionTypes } from 'libs/questions';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import Head from 'next/head'
import dynamic from 'next/dynamic'

const ScreeningQuestionForm = dynamic(() => import('forms/screening-question/screening-question-form'));
const EvaluationQuestionForm = dynamic(() => import('forms/evaluation-question/evaluation-question-form'));

import styles from 'styles/pages/question-create.module.scss';

const QuestionCreatePage = ({ questionType, questionSubtype }) => {
  return <div className={styles['question-create-page']}>
    <Head>
      <title>Create a new {((questionSubtype || questionType).altName || (questionSubtype || questionType).name).toLowerCase()} question  - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>

    { questionType.id == 'screening' ? <ScreeningQuestionForm className={styles['question-create-page-form']} /> : null}
    { questionType.id == 'other' ? <ScreeningQuestionForm type='other' className={styles['question-create-page-form']} /> : null}
    { questionType.id == 'evaluation' ? <EvaluationQuestionForm className={styles['question-create-page-form']} type={(questionSubtype || questionType.subtypes[0]).id} /> : null}
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
