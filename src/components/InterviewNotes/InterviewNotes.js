import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';

import styles from './InterviewNotes.module.scss';

const InterviewNotes = ({ className, value = '', onChange }) => {
  return <div className={classNames(styles['interview-notes'], className)}>
    <h3 className={styles['interview-notes']}>Notes</h3>
    <HtmlInputField
      className={styles['interview-notes-input']}
      value={value}
      onChange={onChange}
      placeholder='Enter your notes here'
      />
  </div>
}

export default InterviewNotes;
