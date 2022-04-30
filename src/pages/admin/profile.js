import classNames from 'classnames';
import dynamic from 'next/dynamic';
import AdminLayout from 'layouts/admin/admin-layout';
import Preloader from 'components/Preloader/Preloader';

const ReactAdminProfileApp = dynamic(() => import("admin/profile.js"), {
  ssr: false,
  loading: () => <Preloader />
})

const ProfileAdminPage = () => {
  return <ReactAdminProfileApp />
}

ProfileAdminPage.layout = AdminLayout

export default ProfileAdminPage;
