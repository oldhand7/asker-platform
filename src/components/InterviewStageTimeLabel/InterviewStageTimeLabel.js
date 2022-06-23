import classNames from "classnames"
import ClockIcon from "components/Icon/ClockIcon"

import styles from './InterviewStageTimeLabel.module.scss';

const InterviewStageTimeLabel = ({ className, time = 0}) => (
    <div className={classNames(
        styles['interview-stage-time-label'],
        className
    )}>
        <ClockIcon className={styles['interview-stage-time-label-text']} />
        <span className={styles['interview-stage-time-label-text']}>{time} min</span>
    </div>
)

export default InterviewStageTimeLabel;