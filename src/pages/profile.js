import { login } from 'libs/user';
import { useRouter } from 'next/router';
import LoginForm from 'forms/login/login-form';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AdminProfileForm from 'forms/admin-profile/admin-profile-form'
import CompanyProfileForm from 'forms/company-profile/company-profile-form'
import { withUserGuardSsr } from 'libs/iron-session';

import 'react-tabs/style/react-tabs.css';
import styles from 'styles/pages/profile.module.scss';

const ProfilePage = () => {
  const [user] = useUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return <div className={styles['profile-page']}>
    {user ? <Tabs className={styles['profile-page-tabs']}>
      <TabList className={styles['profile-page-tab-list']}>
        <Tab className={styles['profile-page-tab']}>Profile</Tab>
        {user && user.type == 'admin' && user.companyId ? <Tab>Company</Tab> : null}
        {/*user && user.type == 'admin' && user.companyId ? <Tab>Interviewers</Tab> : null*/}
      </TabList>

      <TabPanel className={styles['profile-page-tab-panel']}>
        <AdminProfileForm className={styles['profile-page-form']} />
      </TabPanel>
      {user && user.type == 'admin' && user.companyId ? <TabPanel className={styles['profile-page-tab-panel']}>
        <CompanyProfileForm className={styles['profile-page-form']} />
      </TabPanel> : null}
      {user && user.type == 'admin' && user.companyId ? <TabPanel className={styles['profile-page-tab-panel']}>
        Coming soon
      </TabPanel> : null}
    </Tabs> : <span>Loading...</span>}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
})

export default ProfilePage;
