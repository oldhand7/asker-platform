import classNames from 'classnames';
import { useSite } from 'libs/site';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuestionManagerRow from 'components/QuestionManagerRow/QuestionManagerRow';
import ScreeningQuestionModal from 'modals/screening-question/screening-question-modal';
import { useModal } from 'libs/modal';
import EvaluationQuestionModal from 'modals/evaluation-question/evaluation-question-modal';
import { useCallback } from 'react';
import QuestionNoteModal from 'modals/question-note/question-note-modal'

import styles from './SelectedQuestionsManager.module.scss';

const SelectedQuestionsManager = ({ title = 'Selected questions', className, questions, notes = {}, onNotes, onChange, type }) => {
  const { config, t } = useSite();

  const openScreeningQuestionModal = useModal(ScreeningQuestionModal, { size: 'medium'});
  const openEvaluationQuestionModal = useModal(EvaluationQuestionModal, { size: 'large'});
  const openQuestionNoteModal = useModal(QuestionNoteModal, { size: 'medium'})

  const handleQuestionDelete = (question) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    onChange(questions.filter(q => q != question))
  }

  const handleQuestionEdit = useCallback((question) => {
    if (type == 'screening' || type == 'other') {
      openScreeningQuestionModal(updatedQuestion => {
        if (updatedQuestion) {
          const updatedQuestions = [...questions];

          updatedQuestions[updatedQuestions.indexOf(question)] = updatedQuestion;
  
          onChange(updatedQuestions)
        }
      }, { question, type })     
    } else {

      openEvaluationQuestionModal(updatedQuestion => {
        if (updatedQuestion) {
          const updatedQuestions = [...questions];

          updatedQuestions[updatedQuestions.indexOf(question)] = updatedQuestion;
  
          onChange(updatedQuestions)
        }
      }, { question, type: question.subtype })     
    }
  }, [questions, onChange, type])

  const onDragEnd = (result) => {
      const { destination, source, draggableId } = result;

      if (!destination || destination.index == source.index) {
      return;
      }

      const newQuestions = [
          ...questions
      ]

      newQuestions.splice(source.index, 1)
      newQuestions.splice(
          destination.index,
          0,
          questions.find(q => q && q.id == draggableId)
      )

      onChange(newQuestions)
  }

  const handleQuestionNote = q => {
    openQuestionNoteModal(val => {
      //null -> closed without saving
      //object -> saved
      //0 -> deleted
      if (val === null) return;

      const newNotes = {
        ...(notes || {})
      }

      if (!val) {
        delete newNotes[q.id]
      } else {
        newNotes[q.id] = val
      }

      onNotes && onNotes(newNotes)
    }, { note: notes && notes[q.id] })
  }

  return <div data-test-id="question-manager" className={classNames(styles['selected-questions-manager'], className)}>
    <h3 className={styles['selected-questions-manager-title']}>{t('Selected questions')}</h3>

    {questions.length ? <DragDropContext onDragEnd={onDragEnd}>
        <Droppable direction="vertical" droppableId='compare'>{
          (provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps} className={styles['selected-questions-manager-list']}>
            {
              questions.map((q, index) => <Draggable key={q.id} data-test-id={`question-${index}`} draggableId={q.id} index={index}>{
                (provided) => (
                  <QuestionManagerRow hasNote={notes && notes[q.id]} onNote={() => handleQuestionNote(q)} dragDropProps={provided} onEdit={() => handleQuestionEdit(q)} onDelete={() => handleQuestionDelete(q)} question={q} className={styles['selected-questions-manager-list-item']} />
                )}</Draggable>)
            }
          </ul>)
        }</Droppable>
    </DragDropContext> : null}

    {!questions.length ? <p className={styles['selected-questions-manager-list']}>{t('No questions.')}</p> : null}
  </div>
}

export default SelectedQuestionsManager;
