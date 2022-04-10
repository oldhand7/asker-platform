import UserSvg from './assets/icons/user.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const UserIcon = ({ className }) => <UserSvg className={classNames(styles['icon'], styles['icon-user'], className)} />;

export default UserIcon;
