import QuestionSvg from './assets/icons/question.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const QuestionIcon = ({ className }) => <QuestionSvg className={classNames(styles['icon'], styles['icon-question'], className)} />;

export default QuestionIcon;
