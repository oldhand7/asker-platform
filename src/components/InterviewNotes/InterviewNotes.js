import classNames from 'classnames';
import TextareaInput from 'components/TextareaInput/TextareaInput';

import styles from './InterviewNotes.module.scss';

const InterviewNotes = ({ className, value = '', onChange }) => {
  const handleNotes = ev => {
    onChange(ev.target.value)
  }

  return <div className={classNames(styles['interview-notes'], className)}>
    <h3 className={styles['interview-notes']}>Notes</h3>
    <TextareaInput
      className={styles['interview-notes-input']}
      value={value}
      onChange={handleNotes}
      placeholder='Enter your notes here'
      />
  </div>
}

export default InterviewNotes;
