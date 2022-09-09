import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuestionManagerRow from 'components/QuestionManagerRow/QuestionManagerRow';
import ScreeningQuestionModal from 'modals/screening-question/screening-question-modal';
import { useModal } from 'libs/modal';
import EvaluationQuestionModal from 'modals/evaluation-question/evaluation-question-modal';
import { useCallback, useMemo, useEffect, memo } from 'react';
import QuestionNoteModal from 'modals/question-note/question-note-modal'
import { useTranslation } from 'libs/translation';
import { DEFAULT_QUESTION_TIME } from 'libs/config';
import { useFieldArray, useForm, useWatch, useEfffect } from 'react-hook-form';

import styles from './SelectedQuestionsManager.module.scss';

const defaultValue = {
  questions: []
}

const SelectedQuestionsManager = ({ className, questions = [], timetable = {}, notes = {}, onQuestions, onQuestionTime, onQuestionNote, type, subtype }) => {
  const { t } = useTranslation();

  const openScreeningQuestionModal = useModal(ScreeningQuestionModal, { size: 'medium'});
  const openEvaluationQuestionModal = useModal(EvaluationQuestionModal, { size: 'large'});
  const openQuestionNoteModal = useModal(QuestionNoteModal, { size: 'medium'})

  const initValue = useMemo(() => ({ questions }), []);

  const {
    control,
    setValue
  } = useForm({
    defaultValues: initValue
  })

  const questionsApi= useFieldArray({ control, name: 'questions', keyName: '_id' })
  const formQuestions = useWatch({
    control,
    name: 'questions',
    defaultValue: initValue.questions,
  })

  const formValues = useWatch({
    control,
    defaultValue: initValue
  })
  
  useEffect(() => {
    setValue('questions', questions)
  }, [questions])

  useEffect(() => {
      onQuestions && onQuestions(formValues.questions)
  }, [formValues.questions, onQuestions])

  const handleQuestionDelete = (index) => {
    if (!confirm(t('actions.confirm'))) {
      return;
    }

    questionsApi.remove(index)
  }

  const handleQuestionEdit = (question, index) => {
    const updateQuestion = (updatedQuestion) => {
      if (updatedQuestion !== null) {
        questionsApi.update(index, updatedQuestion)
      }
    }

    if (type == 'screening' || type == 'other') {
      openScreeningQuestionModal(updateQuestion, { question, type })     
    } else {
      openEvaluationQuestionModal(updateQuestion, { question, type: question.subtype })     
    }
  }

  const handleDragEnd = useCallback((result) => {
    const { destination, source } = result;

    if (!destination || destination.index == source.index) {
        return;
    }

    questionsApi.move(source.index, destination.index)
  }, [questionsApi])
  

  const handleQuestionNote = (q) => {
    openQuestionNoteModal(val => {
      //null -> closed without saving
      //object -> saved
      //0 -> deleted
      if (val === null) return;
      onQuestionNote && onQuestionNote(q, val)
    }, { note: notes[q.id] })
  }

  const questionTimeHandlers = useMemo(() => {
    const handlers = {};

    for (let i = 0; i < formQuestions.length; i++) {
      const question = formQuestions[i];

      handlers[question.id] = time => onQuestionTime(question, time)
    }

    return handlers;
  }, [formQuestions, onQuestionTime])

  return <div data-test-id="question-manager" className={classNames(styles['selected-questions-manager'], className)}>
    <h3 className={styles['selected-questions-manager-title']}>{t('headings.selected-questions')}</h3>
    {formQuestions.length ? <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable direction="vertical" droppableId='compare'>{
          (provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps} className={styles['selected-questions-manager-list']}>
            {
              formQuestions.map((q, index) => <Draggable key={`${q.id}-${timetable[q.id]}`} data-test-id={`question-${index}`} draggableId={q.id} index={index}>{
                (provided) => (
                  <li 
                  data-test-id="selected-question"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles['selected-questions-manager-list-item']} 
                  >
                  <QuestionManagerRow onEdit={() => handleQuestionEdit(q, index)} onDelete={() => handleQuestionDelete(index)} time={timetable[q.id] || q.time || DEFAULT_QUESTION_TIME} onTimeChange={questionTimeHandlers[q.id]} note={notes && notes[q.id]}  question={q} onNote={() => handleQuestionNote(q)}/>
                  </li>
                )}</Draggable>)
            }
          </ul>)
        }</Droppable>
    </DragDropContext> : null}

    {!formQuestions.length ? <p className={styles['selected-questions-manager-list']}>{t('status.no-questions')}</p> : null}
  </div>
}

const SelectedQuestionsManagerMemo = memo(SelectedQuestionsManager, (prev, next) => {
  if (JSON.stringify(prev.timetable) != JSON.stringify(next.timetable)) {
    return false;
  }

  if (JSON.stringify(prev.notes) != JSON.stringify(next.notes)) {
    return false;
  }

  return prev.questions.length == next.questions.length;
});

SelectedQuestionsManagerMemo.displayName = 'SelectedQuestionsManager';

export default SelectedQuestionsManagerMemo;