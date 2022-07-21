import classNames from 'classnames';
import { useUser } from 'libs/user';
import { useRouter} from 'next/router';

import styles from './company-employees-form.module.scss';

const CompanyEmployeesForm = ({ className }) => {
  const { user } = useUser();
  const router = useRouter();

  return <div data-test-id="company-employees-form" className={classNames(styles['company-employees-form'], className)}>
    {user.companyId ?
    <iframe className={styles['company-employees-form-iframe']} src={`/${router.locale}/admin/profile/#/users?filter=${JSON.stringify({ companyId: user.companyId})}`}></iframe> :
    null}
  </div>
}

export default CompanyEmployeesForm;
