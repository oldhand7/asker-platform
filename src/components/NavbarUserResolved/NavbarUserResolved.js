import Link from 'next/link';
import UserMenu from 'components/UserMenu/UserMenu';
import { useTranslation } from 'libs/translation';

const NavbarUserResolved = ({ user, loading, styles, className }) => {
  const { t } = useTranslation();

return <div className={className}>
    {user && !loading ? <UserMenu className={styles['navbar-session']} /> : null}
    {!user && !loading ? <Link href="/login/">
      <a className={styles['navbar-login-link']}>{t('actions.login')}</a></Link> : null}
    {!user && loading ? <span></span> : null}
  </div>
}

export default NavbarUserResolved;
