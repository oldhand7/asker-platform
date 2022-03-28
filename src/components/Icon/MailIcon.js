import Icon from './Icon';
import MailSvg from './assets/icons/mail.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const MailIcon = ({ className }) => <Icon icon={<MailSvg />} className={classNames(styles['icon-mail'], className)} />;

export default MailIcon;
