import classNames from 'classnames';
import PlatformButton from 'components/Button/PlatformButton';
import { PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect, useMemo, useRef } from 'react';
import PlayIcon from 'components/Icon/PlayIcon';
import { getTimeLabel, secondsToTimeLabel } from 'libs/helper';
import PauseIcon from 'components/Icon/PauseIcon';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import Tooltip from 'components/Tooltip/Tooltip';

import styles from './InterviewFormTimer.module.scss';

const getColor = (timeRemaining, totalTime) => {
  const p = timeRemaining * 100 / totalTime;

  if (p < 25) return '#E77272';

  return '#43B88C';
}

const InterviewFormTimer = ({ className, totalTime = 5, availableTime = 5, onTime, totalStages = 100, completeStages = 25 }) => {
  const [timeRemainingMinutes, setTimeRemainingMinutes] = useState(availableTime);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(availableTime * 60);
  const [playing, setPlaying]  = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!timeRemainingMinutes || !playing) return;

    let seconds = 0;

    const handleSecond = () => {
      seconds += 1;

      setTimeRemainingSeconds(Math.max(timeRemainingMinutes * 60 - seconds, 0))

      if (seconds == 60) {
        const newMinutes = Math.max(timeRemainingMinutes - 1, 0);

        setTimeRemainingMinutes(newMinutes)
        onTime && onTime(newMinutes)
      }
    }

    const int = setInterval(handleSecond, 1000)

    return () => {
      clearInterval(int);
    }
  }, [timeRemainingMinutes, playing])

  const p = useMemo(
    () => !totalStages ? 0 : Math.round(completeStages * 100 / totalStages),
    [completeStages, totalStages])

  const timeLabelSeconds =  useMemo(
      () => secondsToTimeLabel(timeRemainingSeconds),
      [timeRemainingSeconds]
    )

  return <div data-test-id="interview-timer" className={classNames(
    styles['interview-form-timer'],
    playing ? styles['interview-form-timer-active'] : '',
    className
  )}>
    <h3 className={styles['interview-form-timer-title']}>
      Interview progress
    </h3>

    {
      timeRemainingMinutes && !playing ?
      <PlatformButton className={styles['interview-form-timer-button']} type="button" onClick={() => setPlaying(true)}>
        <PlayIcon /> {timeRemainingMinutes == totalTime ? 'Start timer' : 'Continue timer'} ({getTimeLabel(timeRemainingMinutes)})</PlatformButton> :
      null
    }

    {
      timeRemainingMinutes && playing ?
      <PlatformButton className={styles['interview-form-timer-button']} type="button" onClick={() => setPlaying(false)}>
        <PauseIcon /> Pause timer ({getTimeLabel(timeRemainingMinutes)})</PlatformButton> :
      null
    }

      <div className={styles['interview-form-timer-progress-wrapper']}>
        <p>Project progress:</p>

        <div data-test-id="interview-timer" ref={ref} className={styles['interview-form-timer-progress']}>
          <ProgressBar color='#43B88C' p={p} className={styles['interview-form-timer-progress-bar']} />
            <div className={classNames(
              styles['interview-form-timer-progress-label'],
              styles['interview-form-timer-progress-label-positive']
            )}>
              <span style={{width: ref && ref.current ? `${ref.current.clientWidth}px` : 0}} className={styles['interview-form-timer-progress-label-text']}>{p}%</span>
            </div>


            <div style={{ width: `${p}%`}} className={classNames(
              styles['interview-form-timer-progress-label'],
              styles['interview-form-timer-progress-label-negative']
            )}>
              <span style={{width: ref && ref.current ? `${ref.current.clientWidth}px` : 0}} className={styles['interview-form-timer-progress-label-text']}>{p}%</span>
            </div>
        </div>
      </div>
    
  </div>
}

export default InterviewFormTimer;
