import TextSvg from './assets/icons/text.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const TextIcon = ({ className }) => <TextSvg className={classNames(styles['icon'], styles['icon-text'], className)} />;

export default TextIcon;
