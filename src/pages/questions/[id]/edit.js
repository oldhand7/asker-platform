import { criteriaTypes } from 'libs/criteria';
import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { getSingleDocument } from 'libs/firestore-admin';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const ScreeningQuestionForm = dynamic(() => import('forms/screening-question/screening-question-form'));
const EvaluationQuestionForm = dynamic(() => import('forms/evaluation-question/evaluation-question-form'));

import styles from 'styles/pages/question-edit.module.scss';

const QuestionEditPage = ({ question }) => {
  return <div className={styles['question-edit-page']}>
    <Head>
      <title>{question.name} - {question.companyId === 'asker' ? 'Clone' : 'Edit'} question - Asker</title>
    </Head>

    {question.type == 'other' ? <ScreeningQuestionForm type='other' question={question} className={styles['question-edit-page-form']} /> : null}
    {question.type == 'screening' ? <ScreeningQuestionForm question={question} className={styles['question-edit-page-form']} /> : null}
    {question.type == 'evaluation' ? <EvaluationQuestionForm question={question} className={styles['question-edit-page-form']} subtype={criteriaTypes.find(c => c.id == question.subtype)}  /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const question = await getSingleDocument('questions', query.id)

  if (!question) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config: await getSettings(),
      question: JSON.parse(JSON.stringify(question))
    }
  }
})

export default QuestionEditPage;
