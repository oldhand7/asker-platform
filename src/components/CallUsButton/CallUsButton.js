import PhoneIcon from 'components/Icon/PhoneIcon';
import Link from 'next/link';
import classNames from 'classnames';

import styles from './CallUsButton.module.scss';

const CallUsButton = ({ href = '#', className }) => {
  return <Link href={href}>
    <a className={classNames(styles['call-us-button'], className)}>
      <PhoneIcon className={styles['call-us-button-icon']} />
    </a>
  </Link>
}

export default CallUsButton;
