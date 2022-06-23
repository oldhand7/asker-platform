const { default: classNames } = require("classnames")
import { secondsToTimeLabel } from 'libs/helper';
import Tooltip from 'components/Tooltip/Tooltip';
import CheckIcon from 'components/Icon/CheckIcon'
import { handleNext } from 'libs/helper'

import styles from './InterviewStatus.module.scss';

const InterviewStatus = ({ className, stats = []}) => {
    const handleNavigate = stat => {
        if (!stat.questionId) {
            handleNext(`stage-${stat.id}`)
        } else {
            handleNext(`stage-${stat.id}-${stat.questionId}`)
        }
    }

    return <ul className={classNames(styles['interview-status'], className)}>
        {stats.map((stat, index) => {

            return <Tooltip key={`${stat.id}-${stat.questionId || ''}`} text={stat.hint}>{ref => <li ref={ref} onClick={() => handleNavigate(stat)}  className={classNames(
                styles['interview-status-item'],
                stat.time || stat.status == 'complete'  ? styles[`interview-status-item-${stat.status}`] : ''
        )}>
                <div className={styles['interview-status-coin']}>
                    {
                        stat.status == 'complete' ?
                        <CheckIcon className={styles['interview-status-coin-icon']} /> :
                        (index+1)
                    }
                </div>
                <div className={styles['interview-status-item-summary']}>
                    <span className={styles['interview-status-item-status']}>
                        {
                            !stat.time ? 'Not started' : (
                                stat.status == 'complete' ? 'Completed' : 'In progress'
                            )
                        }
                    </span>
                    <h4 className={styles['interview-status-item-name']}>{stat.name}</h4>
                    <span className={styles['interview-status-item-time']}>
                        {stat.status == 'complete' && stat.time ? secondsToTimeLabel(stat.time) : null}
                    </span>
                </div>
            </li>}</Tooltip>
        })}
    </ul>
}

export default InterviewStatus;