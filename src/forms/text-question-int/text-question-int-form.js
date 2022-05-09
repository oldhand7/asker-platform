import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './text-question-int-form.module.scss';

const TextQuestionIntForm = ({ className, question, values, onValues }) => {
  return <div className={classNames(styles['text-question-int-form'], className)}>
  <h3 className={styles['text-question-int-form-title']}>{question.name}</h3>
  <div className={styles['text-question-int-form-desc']}
  dangerouslySetInnerHTML={{ __html: striptags(question.desc, allowedHtmlTags) }}></div>

    <HtmlInputField value={(values || [''])[0]} className={styles['text-question-int-form-note']} onChange={value => onValues([value])}  />
  </div>
}

export default TextQuestionIntForm;
