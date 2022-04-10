import MailSvg from './assets/icons/mail.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const MailIcon = ({ className }) => <MailSvg className={classNames(styles['icon'], styles['icon-mail'], className)} />;

export default MailIcon;
