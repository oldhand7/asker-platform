import ChatSvg from './assets/icons/chat.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ChatIcon = ({ className }) => <ChatSvg className={classNames(styles['icon'], styles['icon-chat'], className)} />;

export default ChatIcon; 
