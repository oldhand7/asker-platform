import classNames from 'classnames';

import styles from './QuestionScoreBoardVertical.module.scss';

const QuestionScoreBoardVertical = ({ className, index, rule, scores = [], active, onScores, onHead }) => {
  const toggleStep = (index) => {
    const newScores = [...scores];
    newScores[index] = !newScores[index]
    onScores(newScores)
  }

  return <div className={classNames(
    styles['question-score-board-vertical'],
    className,
    active ? styles['question-score-board-vertical-active'] : '',
    !rule.steps ? styles['question-score-board-vertical-empty'] : ''
  )}>
    <div onClick={onHead} className={styles['question-score-board-vertical-head']}>
      <h4 className={styles['question-score-board-vertical-head-title']}>{index}</h4>
      <span className={styles['question-score-board-vertical-head-name']}>{rule.name}</span>
    </div>
    <ul className={styles['question-score-board-vertical-steps']}>
      {(rule.steps || []).map((step, index) => (
        <li onClick={() => toggleStep(index)} key={index} className={classNames(
          styles['question-score-board-vertical-steps-step'],
          scores[index] ? styles['question-score-board-vertical-steps-step-active'] : ''
        )}>{step}</li>
      ))}
    </ul>
  </div>
}

export default QuestionScoreBoardVertical;
