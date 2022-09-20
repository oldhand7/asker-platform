import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import PlusIcon from 'components/Icon/PlusIcon';
import { useCallback, useEffect, useMemo } from 'react';
import TrashButton from 'components/TrashButton/TrashButton';
import { useForm } from 'libs/react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

import styles from './answers-form.module.scss';

const createAnswer = () => ({ uid: uuidv4(), name: { en: '' } })

const defaultValues = [
  createAnswer(),
  createAnswer()
]

const AnswersForm = ({ values = [], className, onValues, title = '' }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const initValues = useMemo(() => ({
    items: values.length && values || defaultValues
  }), [])

  const {
    setValue,
    control
  } = useForm({
    values: initValues
  })

  const formValues = useWatch({
    control,
    defaultValue: initValues,
    keyName: '_id'
  })

  const {
    fields: items,
    ...itemsApi
  } = useFieldArray({ control, name: 'items' })

  const addAnswer  = useCallback(() => {
    itemsApi.append(createAnswer)

    setTimeout(() => {
      const inputEl = document.querySelector('ul li:last-child input')

      if (inputEl) {
        inputEl.focus()
      }
    }, 100)
  }, [itemsApi])

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
    if (!confirm(t('actions.confirm'))) {
      return;
    }

    itemsApi.remove(index)
  }

  useEffect(() => {
      onValues && onValues(formValues.items)
  }, [formValues, onValues])

  const valueHandlers = useMemo(() => {
    const handlers = {}

    for (let i = 0; i < items.length; i++) {
      handlers[i] = ev => setValue(`items.${i}.name.${locale}`, ev.target.value)
    }

    return handlers;
  }, [items, locale, setValue])

  return <div data-test-id="answers-form" className={classNames(styles['answers-form'], className)}>
    <h3>{title ? title : t('labels.answers')}</h3>

    <ul className={styles['answers-form-list']}>
      {formValues.items.map((answer, index) => (<li key={index} className={styles['answers-form-list-item']}>
        <TextInputField value={answer.name[locale]} onEnter={handleFocusNext} className={styles['answers-form-list-item-input']} name={`answers[${index}].name.${locale}`} autoComplete="off" onChange={valueHandlers[index]} placeholder={`${t('labels.answer')} ${index + 1}`} />
        <TrashButton type="button" onClick={() => handleAnswerDelete(index)} className={styles['answers-form-list-item-button']} />
      </li>))}
    </ul>

    <OutlineButton onClick={addAnswer} type="button"><PlusIcon /> {t('Add answer')}</OutlineButton>
  </div>
}

export default AnswersForm;
