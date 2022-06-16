import EditFieldSvg from './assets/icons/edit-field.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const EditFieldIcon = ({ className }) => <EditFieldSvg className={classNames(styles['icon'], styles['icon-edit-field'], className)} />;

export default EditFieldIcon;
