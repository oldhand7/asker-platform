import classNames from 'classnames';
import { useMemo, useState } from 'react';
import UpDownButton from 'components/UpDownButton/UpDownButton';
import { createSumReducer } from 'libs/helper';
import InterviewStatus from 'components/InterviewStatus/InterviewStatus';

import styles from './InterviewProcessOverview.module.scss';

const QuestionCount = ({ count = 0}) => (
  <div className={styles['interview-process-overview-question-count']}>
    <span className={styles['interview-process-overview-question-count-title']}>Left:</span>
    <span className={styles['interview-process-overview-question-count-value']}>{count}</span>
  </div>)

const InterviewProcessOverview = ({ className ='xx', interview, stats = []}) => {
  // const [questionsRemaining, setQuestionsRemaining] = useState(10)
  const [open, setOpen] = useState(false);

  const questionsRemaining = useMemo(
    () => stats.filter(stat => stat.status == 'awaiting').reduce(createSumReducer('questions'), 0),
    [stats]
  )

  return <div data-test-id="interview-process-overview" className={classNames(
    styles['interview-process-overview'],
    className
  )}>

    <div onClick={() => setOpen(!open)} className={styles['interview-process-overview-head']}>
      <h3 className={styles['interview-process-overview-title']}>
        Process overview
      </h3>
      <UpDownButton on={open} className={styles['interview-process-overview-toggle']} />
    </div>

    {
      open ?
      <>
        <div className={styles['interview-process-overview-subhead']}>
          <h3 className={styles['interview-process-overview-subhead-title']}>
            Questions
          </h3>
          <QuestionCount count={questionsRemaining} className={styles['interview-process-overview-subhead-counter']} />
        </div>
        <InterviewStatus stats={stats} className={styles['interview-process-overview-status']} />
      </> :
      null
    }
  </div>
}

export default InterviewProcessOverview;
