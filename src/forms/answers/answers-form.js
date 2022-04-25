import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import PlusIcon from 'components/Icon/PlusIcon';
import useForm from 'libs/use-form';
import { useEffect, useState } from 'react';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './answers-form.module.scss';

const defaultValues = {
  name: ''
}

const validationRules = {
  name: 'required|max:140'
}

const validationMessages = {}

const AnswersForm = ({ values = [], className, onValues, title = '' }) => {

  useEffect(() => {
    if ((values || []).length < 2) {
      onValues([
        ...((values || [])),
        ''
      ])
    }
  }, [values])

  const addAnswer  = () => {
    onValues([
      ...(values || []),
      ''
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

      inputEl.select()
    }

    if (liEl && !liEl.nextSibling) {
      addAnswer()
    }
  }

  const handleAnswerChange = (index, value = '') => {
    const newAnswers = [...(values || [])]
    newAnswers[index] = value;
    onValues(newAnswers)
  }

  const handleAnswerDelete = (index) => {
    if ((values || []).length == 2) {
        handleAnswerChange(index, '')

        return;
    }

    onValues([
      ...(values || []).slice(0, index),
      ...(values || []).slice(index + 1)
    ])
  }

  return <div className={classNames(styles['answers-form'], className)}>
    <h3>{title ? title : 'Answers'}</h3>

    <ul className={styles['answers-form-list']}>
      {(values || []).map((answer, index) => (<li key={index} className={styles['answers-form-list-item']}>
        <TextInputField value={answer} onEnter={handleFocusNext} className={styles['answers-form-list-item-input']} name="answer" autoComplete="off" onChange={(ev) => handleAnswerChange(index, ev.target.value)} placeholder={`Answer ${index + 1}`} />
        <TrashButton type="button" onClick={() => handleAnswerDelete(index)} className={styles['answers-form-list-item-button']} />
      </li>))}
    </ul>

    <OutlineButton onClick={addAnswer} type="button"><PlusIcon /> Add answer</OutlineButton>
  </div>
}

export default AnswersForm;
