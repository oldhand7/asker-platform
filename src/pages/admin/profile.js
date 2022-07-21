import dynamic from 'next/dynamic';
import AdminLayout from 'layouts/admin/admin-layout';
import Preloader from 'components/Preloader/Preloader';
import { getTranslations } from 'libs/firestore-admin';
import { useRouter } from 'next/router';

const ReactAdminProfileApp = dynamic(() => import("admin/profile.js"), {
  ssr: false,
  loading: () => <Preloader />
})

const ProfileAdminPage = ({ translations }) => {
  const router = useRouter();

  return <ReactAdminProfileApp locale={router.locale} translations={translations} />
}

export const getServerSideProps = async () => {
  return {
    props: {
      translations: await getTranslations()
    }
  }
}

ProfileAdminPage.layout = AdminLayout

export default ProfileAdminPage;
