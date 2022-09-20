import { useRouter } from 'next/router';
import ForgottenForm from 'forms/forgotten/forgotten-form';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import Head from 'next/head';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/forgotten.module.scss';

const ForgottenPage = () => {
  const router = useRouter();
  const { user } = useUser()

  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      router.push('/projects/')
    }
  }, [user, router])

  return <div className={styles['forgotten-page']}>
    <Head>
      <title>{t('headings.forgotten')} - {t('actions.login')}  - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>
    <ForgottenForm className={styles['forgotten-page-form']}  />
  </div>
}

export const getServerSideProps = async ({ req }) => {
  return {
    props: {
      config: await getSettings()
    }
  }
}

ForgottenPage.noAuth = true;

export default ForgottenPage;
