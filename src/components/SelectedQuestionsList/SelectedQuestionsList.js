import classNames from 'classnames';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import TrashButton from 'components/TrashButton/TrashButton';
import EvaluationQuestionsTable from 'components/EvaluationQuestionsTable/EvaluationQuestionsTable';
import ScreeningQuestionsTable from 'components/ScreeningQuestionsTable/ScreeningQuestionsTable';

import styles from './SelectedQuestionsList.module.scss';

const SelectedQuestionsList = ({ title = 'Selected questions', feature, className, questions, onChange }) => {

  const handleQuestionDel = (question) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    onChange(questions.filter(q => q != question))
  }

  return <div data-test-id="selected-questions-list" className={classNames(styles['selected-question-list'], className)}>
    <h3 className={styles['selected-question-list-title']}>{title}</h3>
    {
      feature.id == 'other-questions' || feature.id == 'screening-questions' ?
      <ScreeningQuestionsTable data={questions} onDelete={handleQuestionDel} /> :
      <EvaluationQuestionsTable criteria={feature && feature.metadata && feature.metadata.criteria} data={questions} onDelete={handleQuestionDel} />
    }
  </div>
}

export default SelectedQuestionsList;
