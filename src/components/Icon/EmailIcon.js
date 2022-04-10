import EmailSvg from './assets/icons/email.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const EmailIcon = ({ className }) => <EmailSvg className={classNames(styles['icon'], styles['icon-email'], className)} />;

export default EmailIcon;
