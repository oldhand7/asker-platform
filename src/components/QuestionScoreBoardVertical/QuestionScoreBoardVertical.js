import classNames from 'classnames';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useTranslation } from 'libs/translation';

import styles from './QuestionScoreBoardVertical.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import { height } from '../../../__mocks__/fileMock';

const QuestionScoreBoardVertical = ({ className, index, rule, scores = [], lock = true, onRow, heights = [], onHeights, rowActive, active, onScores, onHead }) => {
  const { i18nField } = useTranslation();

  const ref = useRef();

  const toggleStep = useCallback((index) => {
    const newScores = [
      ...scores
    ];

    newScores[index] = !scores[index]

    onScores(newScores, index)
  }, [lock, scores, onScores])

  useEffect(() => {
    if (ref.current) {
      const heights = [];

      for (let i = 0; i < ref.current.children.length; i++) {
        heights.push(ref.current.children[i].clientHeight)
      }

      onHeights(heights)
    }
  }, [onHeights])

  return <div className={classNames(
    styles['question-score-board-vertical'],
    className,
    active ? styles['question-score-board-vertical-active'] : '',
    !rule.steps ? styles['question-score-board-vertical-empty'] : ''
  )}>
    <div onClick={onHead} className={styles['question-score-board-vertical-head']}>
      <h4 className={styles['question-score-board-vertical-head-title']}>{index}</h4>
      <span className={styles['question-score-board-vertical-head-name']}>{i18nField(rule.name)}</span>
    </div>
    <ul ref={ref} className={styles['question-score-board-vertical-steps']}>
      {(rule.steps || []).map((step, index) => (
        <li style={{ minHeight: (heights && heights[index] || '0') + 'px'}} onMouseOver={() => onRow && onRow(index)} onMouseLeave={() => onRow && onRow(-1)} onClick={() => toggleStep(index)} key={index} className={classNames(
          styles['question-score-board-vertical-steps-step'],
          rowActive === index ? styles['question-score-board-vertical-steps-step-candidate'] : '',
          'format',
          scores[index] ? styles['question-score-board-vertical-steps-step-active'] : ''
        )} dangerouslySetInnerHTML={{__html: striptags(i18nField(step), allowedHtmlTags)}}></li>
      ))}
    </ul>
  </div>
}

export default QuestionScoreBoardVertical;
