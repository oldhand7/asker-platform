import classNames from 'classnames';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';

import styles from './text-question-int-form.module.scss';

const TextQuestionIntForm = ({ className, question, values, onValues }) => {
  return <div className={classNames(styles['text-question-int-form'], className)}>
    <h3>{question.name}</h3>
    <p>{question.desc}</p>

    <TextareaInputField value={(values || [''])[0]} className={styles['text-question-int-form-note']} onChange={ev => onValues([ev.target.value])}  />
  </div>
}

export default TextQuestionIntForm;
