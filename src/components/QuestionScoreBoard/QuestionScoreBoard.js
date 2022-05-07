import classNames from 'classnames';
import QuestionScoreBoardVertical from 'components/QuestionScoreBoardVertical/QuestionScoreBoardVertical';

import styles from './QuestionScoreBoard.module.scss';

const QuestionScoreBoard = ({ className, score = 0, rules, votes = [], onVotes, onError }) => {
  const handleScores = (scores, index) => {
    if (!onVotes) {
      return;
    }

    const newVotes = [...votes];

    newVotes[index] = {
      head: scores.some(s => s),
      tail: scores
    }

    onVotes(newVotes)
  }

  const toggleHead = (index) => {
    const vOff = votes.map((v, i) => ({
      head: false,
      tail: v.tail.map(_ => false)
    }));

    if (score != index + 1) {
      vOff[index].head = true;
      vOff[index].tail = vOff[index].tail.map(_ => true);
    }

    onVotes(vOff)
  }

  return <ul className={classNames(styles['question-score-board'], className)}>
      {rules.map((rule, index) => <li className={styles['question-score-board-column']} key={index}>
        <QuestionScoreBoardVertical
          index={index + 1}
          rule={rule}
          active={score == index + 1}
          scores={votes[index]  ? votes[index].tail : []}
          onScores={scores => handleScores(scores, index)}
          onHead={() => toggleHead(index)}
          className={styles['question-score-board-column-item']}
        />
      </li>)}
    </ul>
}

export default QuestionScoreBoard;
