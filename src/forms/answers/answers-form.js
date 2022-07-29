import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import PlusIcon from 'components/Icon/PlusIcon';
import { useEffect } from 'react';
import TrashButton from 'components/TrashButton/TrashButton';
import { useSite } from 'libs/site';
import { useForm } from 'libs/react-hook-form';
import { useUser } from 'libs/user';
import { v4 as uuidv4 } from 'uuid';

import styles from './answers-form.module.scss';

const createAnswer = () => ({ uid: uuidv4(), name: { en: '' } })

const defaultValues = [
  createAnswer(),
  createAnswer()
]

const AnswersForm = ({ values = [], className, onValues, title = '' }) => {
  const { t } = useSite();
  const { locale } = useUser();
  const {
    values: formValues,
    setValue,
    errors,
    input
  } = useForm({
    values: {
      items: values.length && values || defaultValues
    }
  })

  const addAnswer  = () => {
    setValue('items', [
      ...formValues.items,
      createAnswer()
    ])

    setTimeout(() => {
      const inputEl = document.querySelector('ul li:last-child input')

      if (inputEl) {
        inputEl.focus()
      }
    }, 100)
  }

  const handleFocusNext = (ev) => {
    const liEl = ev.target.closest('li')

    if (liEl && liEl.nextSibling) {
      const inputEl = liEl.nextSibling.querySelector('input')

      inputEl.focus()
    }

    if (liEl && !liEl.nextSibling) {
      addAnswer()
    }
  }

  const handleAnswerDelete = (index) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    setValue('items', [
      ...formValues.items.slice(0, index),
      ...formValues.items.slice(index + 1)
    ])
  }

  useEffect(() => {
    if (JSON.stringify(formValues.items) != JSON.stringify(values)) {
      onValues(formValues.items)
    }
  }, [formValues])

  return <div data-test-id="answers-form" className={classNames(styles['answers-form'], className)}>
    <h3>{title ? title : t('Answers')}</h3>

    <ul className={styles['answers-form-list']}>
      {formValues.items.map((answer, index) => (<li key={index} className={styles['answers-form-list-item']}>
        <TextInputField value={answer.name[locale]} onEnter={handleFocusNext} className={styles['answers-form-list-item-input']} name={`answers[${index}].name.${locale}`} autoComplete="off" onChange={input(`items.${index}.name.${locale}`)} placeholder={`${t('Answer')} ${index + 1}`} />
        <TrashButton type="button" onClick={() => handleAnswerDelete(index)} className={styles['answers-form-list-item-button']} />
      </li>))}
    </ul>

    <OutlineButton onClick={addAnswer} type="button"><PlusIcon /> {t('Add answer')}</OutlineButton>
  </div>
}

export default AnswersForm;
