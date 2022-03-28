import dynamic from 'next/dynamic'

import styles from 'styles/pages/admin.module.scss';

const ReactAdminApp = dynamic(() => import("admin/index.js"), { ssr: false })

const AdminPage = () => {
  return <div className={styles['react-admin']}>
     <ReactAdminApp />
   </div>
}

AdminPage.layout = 'admin';

export default AdminPage;
