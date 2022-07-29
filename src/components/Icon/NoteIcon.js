import NoteSvg from './assets/icons/note.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const NoteIcon = ({ className }) => <NoteSvg className={classNames(styles['icon'], styles['icon-note'], className)} />;

export default NoteIcon;
