const { DEFAULT_STAGE_TIME } = require("libs/config");
const { useState, useEffect, useCallback } = require("react");
import classNames from 'classnames';
import MinutesInput from 'components/MinutesInput/MinutesInput';

import styles from './TimedTitle.module.scss';

const TimedTitle = ({ className, time = DEFAULT_STAGE_TIME, onChange, children, text = '' }) => {
    const [t, setTime] = useState(time);

    useEffect(() => {
        setTime(time)
    }, [time])

    const handleChange = useCallback((t) => {
        setTime(t)
        onChange && onChange(t)
    }, [onChange])

    return <div className={classNames(
        styles['timed-title'],
        className
    )}>
        <h3 className={styles['timed-title-text']}>{children || text}</h3>
        <MinutesInput className={styles['timed-title-time-input']} value={t} onChange={onChange && handleChange} />
    </div>
}

export default TimedTitle;