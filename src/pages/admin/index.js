import dynamic from 'next/dynamic'
import AdminLayout from 'layouts/admin/admin-layout';
import { useRouter } from 'next/router';

import styles from 'styles/pages/admin.module.scss';

const ReactAdminApp = dynamic(() => import("admin/index.js"), { ssr: false })

const AdminPage = () => {
  const router = useRouter();

  return <div className={styles['react-admin']}>
     <ReactAdminApp />
   </div>
}

AdminPage.layout = AdminLayout;
AdminPage.noAuth = true;

export default AdminPage;
