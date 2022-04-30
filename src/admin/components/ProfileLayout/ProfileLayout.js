import { Layout } from 'react-admin';

import styles from './ProfileLayout.module.scss';

const ProfileLayout = props => <Layout
    {...props}
    className={styles['profile-layout']}
    appBar={() => null}
    sidebar={() => null}
/>;

export default ProfileLayout;
