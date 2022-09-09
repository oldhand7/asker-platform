
import { useEffect, useLayoutEffect, useState } from 'react';
import InterviewerSelect from './InterviewerSelect';

import styles from './InterviewerSelectPreview.module.scss';

const users = [
    { id: 'u1', name: 'User 1' },
    { id: 'u2', name: 'User 2' },
    { id: 'u3', name: 'User 3' }
]

const InterviewerSelectPreview = () => {
    const [error, setError] = useState('');
    const [interviewer, setInterviewer] = useState(users[0])

    const firestoreApi = {
        filterManyDocuments: () => Promise.resolve(users)
    }
    return <div>
        <div>
            <h2>With default interviewer</h2>
            <div>
                <button onClick={() => setError('Errrrrrrrrrrror')}>Add error</button>
            </div>
            <InterviewerSelect error={error} className={styles['interviewer-select']}  firestoreApi={firestoreApi} />
        </div>
        <div>
            <h2>Without default interviewer: {interviewer ? interviewer.id : '-'}</h2>
            <small>NOTE: Default value not working due to  compnent being loaded dynamicly.</small>
            <InterviewerSelect onChange={setInterviewer} interviewer={interviewer} className={styles['interviewer-select']}  firestoreApi={firestoreApi} />
        </div>
    </div>
}

export default InterviewerSelectPreview;