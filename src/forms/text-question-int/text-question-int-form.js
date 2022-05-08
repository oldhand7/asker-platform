import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';

import styles from './text-question-int-form.module.scss';

const TextQuestionIntForm = ({ className, question, values, onValues }) => {
  return <div className={classNames(styles['text-question-int-form'], className)}>
    <h3>{question.name}</h3>
    <p>{question.desc}</p>

    <HtmlInputField value={(values || [''])[0]} className={styles['text-question-int-form-note']} onChange={value => onValues([value])}  />
  </div>
}

export default TextQuestionIntForm;
