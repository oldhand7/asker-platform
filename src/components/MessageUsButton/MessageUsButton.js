import ChatIcon from 'components/Icon/ChatIcon';
import classNames from 'classnames';

import styles from './MessageUsButton.module.scss';

const MessageUsButton = ({ onClick, className }) => {
  return <button onClick={onClick} className={classNames(styles['message-us-button'], className)}>
      <ChatIcon className={styles['message-us-button-icon']} />
    </button>
}

export default MessageUsButton;
