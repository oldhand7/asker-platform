import Link from 'next/link';
import UserMenu from 'components/UserMenu/UserMenu';

const NavbarUserResolved = ({ user, loading, styles, className }) => (<div className={className}>
    {user && !loading ? <UserMenu className={styles['navbar-session']} /> : null}
    {!user && !loading ? <Link href="/login/">
      <a className={styles['navbar-login-link']}>Login</a></Link> : null}
    {!user && loading ? <span></span> : null}
  </div>)

export default NavbarUserResolved;
