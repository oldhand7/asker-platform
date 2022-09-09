import { withUserGuardSsr } from 'libs/iron-session';
import { getSettings } from 'libs/firestore-admin';
import { getSingleDocument } from 'libs/firestore-admin';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/question-edit.module.scss';

const ScreeningQuestionForm = dynamic(() => import('forms/screening-question/screening-question-form'));
const EvaluationQuestionForm = dynamic(() => import('forms/evaluation-question/evaluation-question-form'));

const QuestionEditPage = ({ question }) => {
  const { t, i18nField } = useTranslation();
  
  return <div className={styles['question-edit-page']}>
    <Head>
      <title>{i18nField(question.name)} - {question.companyId === 'asker' ? t('actions.clone.question') : t('actions.edit-question')} - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>

    {question.type == 'other' ? <ScreeningQuestionForm type='other' question={question} className={styles['question-edit-page-form']} /> : null}
    {question.type == 'screening' ? <ScreeningQuestionForm question={question} className={styles['question-edit-page-form']} /> : null}
    {question.type == 'evaluation' ? <EvaluationQuestionForm question={question} className={styles['question-edit-page-form']} type={question.subtype}  /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/questions/${query.id}/edit/`;
    
    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

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
