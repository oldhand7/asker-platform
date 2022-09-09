import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useMemo } from 'react';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

import styles from './text-question-int-form.module.scss';

const TextQuestionIntForm = ({ className, question, values, onValues }) => {
  const { i18nField } = useTranslation();
  const { locale } = useRouter();

  const questionIntName = i18nField(question.name);
  const questionIntDesc = i18nField(question.desc);

  const initValue = useMemo(() => (values || [''])[0], [])

  return <div className={classNames(styles['text-question-int-form'], className)}>
    <h3 className={styles['text-question-int-form-title']}>{questionIntName}</h3>
    <div className={styles['text-question-int-form-desc']}
    dangerouslySetInnerHTML={{ __html: striptags(questionIntDesc, allowedHtmlTags) }}></div>

    <HtmlInputField diff={locale} value={initValue} className={styles['text-question-int-form-note']} onChange={value => onValues([value])}  />
  </div>
}

export default TextQuestionIntForm;
