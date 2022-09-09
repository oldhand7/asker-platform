import classNames from 'classnames'
import { secondsToTimeLabel } from 'libs/helper';
import Tooltip from 'components/Tooltip/Tooltip';
import CheckIcon from 'components/Icon/CheckIcon'
import { handleNext } from 'libs/helper'
import { useTranslation } from 'libs/translation';

import styles from './InterviewStatus.module.scss';

const InterviewStatus = ({ className, stats = []}) => {
    const { t, i18nField }  = useTranslation();

    const handleNavigate = stat => {
        if (!stat.questionId) {
            handleNext(`stage-${stat.id}`)
        } else {
            handleNext(`stage-${stat.id}-${stat.questionId}`)
        }
    }

    return <ul className={classNames(styles['interview-status'], className)}>
        {stats.map((stat, index) => {

            return <Tooltip key={`${stat.id}-${stat.questionId || ''}`} text={i18nField(stat.hint)}>{ref => <li ref={ref} onClick={() => handleNavigate(stat)}  className={classNames(
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
                            stat.status == 'complete' ? t('status.completed') : (
                                stat.time ? t('status.in-progress') : t('status.not-started')
                            )
                        }
                    </span>
                    <h4 className={styles['interview-status-item-name']}>{i18nField(stat.name)}</h4>
                    <span className={styles['interview-status-item-time']}>
                        {stat.status == 'complete' && stat.time ? secondsToTimeLabel(stat.time) : null}
                    </span>
                </div>
            </li>}</Tooltip>
        })}
    </ul>
}

export default InterviewStatus;