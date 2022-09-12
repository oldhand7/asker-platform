import classNames from 'classnames';
import QuestionScoreBoardVertical from 'components/QuestionScoreBoardVertical/QuestionScoreBoardVertical';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './QuestionScoreBoard.module.scss';

const QuestionScoreBoard = ({ className, rules, votes = [], onVotes, onError }) => {
  const [lock, setLock] = useState(false);
  
  const [rowActive, setRowActive] = useState(-1)

  const heightsGlobal = useRef((rules[0].steps || []).map(r => 0))

  const handleHead = (index) => {
    if (!onVotes) {
      return;
    }

    const vOff = votes.map((v, i) => ({
      head: false,
      tail: v.tail
    }));

    vOff[index].head = true;

    onVotes(vOff)
  }

  const handleTail = (scores, index, rowIndex) => {
    if (!onVotes) {
      return;
    }

    const vote = votes.find(v => v.head)

    const newVotes = votes.map(v => {

      return {
        head: false,
        tail: v.tail.map((cell, cellIndex) => cellIndex == rowIndex ? false : cell)
      }
    });

    newVotes[index].tail = scores;

    if (!vote || vote.head === 1) {
      const touched = newVotes
        .map((v, i) => v.tail.find(t => t) ? i+1 : 0)
        .filter(s => s)


      if (touched.length != 0) {
        const sum = touched.reduce((sum, x) => x + sum, 0)
        newVotes[Math.round(sum / touched.length) - 1].head = 1;
      }
    } else if (vote) {
      newVotes[votes.indexOf(vote)].head = true;
    }

    onVotes(newVotes)
  }

  useEffect(() => {
    if (!votes) {
      return;
    }

    const count = votes.reduce((count, votes) => {
      let tailCount = 0;

      for (let i = 0; i < votes.tail.length; i++) {
        if (votes.tail[i]) {
          tailCount++
        }
      }

      return count + tailCount
    }, 0)

    setLock(count == 3);
  }, [votes])

  const adjustHeights = (heights = []) => {
    heightsGlobal.current = heightsGlobal.current.map(
      (h, index) => Math.max(h, typeof heights[index] !== "undefined" ? Number.parseFloat(heights[index]) : 0)
    )
  }

  return <ul data-test-id="question-score-board" className={classNames(styles['question-score-board'], className)}>
      {rules.map((rule, index) => <li data-test-id={votes && votes[index] && votes[index].head ? 'question-score-board-active' : undefined}  className={styles['question-score-board-column']} key={index}>
        <QuestionScoreBoardVertical
          lock={lock}
          index={index + 1}
          onHeights={adjustHeights}
          heights={heightsGlobal.current}
          rowActive={rowActive}
          onRow={setRowActive}
          rule={rule}
          active={votes && votes[index] && votes[index].head}
          scores={votes && votes[index] ? votes[index].tail : []}
          onScores={(scores, rowIndex) => handleTail(scores, index, rowIndex)}
          onHead={() => handleHead(index)}
          className={styles['question-score-board-column-item']}
        />
      </li>)}
    </ul>
}

export default QuestionScoreBoard;
