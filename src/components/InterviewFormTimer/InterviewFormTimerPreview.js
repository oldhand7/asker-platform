import { useState } from 'react';
import InterviewFormTimer from './InterviewFormTimer';

import styles from './InterviewFormTimerPreview.module.scss';

const totalTime = 1;
const totalStages = 5;

const InterviewFormTimerPreview = () => {
    const [time, setTime] = useState(totalTime);
    const [stages, setStages] = useState(0);

    return <div>
        <div>
            <button onClick={() => setStages(Math.max(stages - 1, 0))}>-1 stage</button>
            <button onClick={() => setStages(Math.min(stages + 1, totalStages))}>+1 stage</button>
        </div>
        <InterviewFormTimer
        className={styles['interview-form-timer']}
        onTime={setTime}
        totalTime={totalTime}
        availableTime={time}
        totalStages={totalStages}
        completeStages={stages}
        />
    </div>
}

export default InterviewFormTimerPreview;