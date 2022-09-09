import { useCallback, useState } from 'react'
import FeatureForm from './FeatureForm';

import styles from './FeatureFormPreview.module.scss';

const FeatureFormPreview = () => {
    const [stage, setStage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false)

    const stages = [
        { id: 'introduction', uuid: '1' },
        { id: 'introduction', uuid: '2' },
        { id: 'summary', uuid: '3' }
    ]

    return <div>
        <button onClick={() => setStage(stages[0])}>Stage 1</button>
        <button onClick={() => setStage(stages[1])}>Stage 2</button>
        <button onClick={() => setStage(stages[2])}>Stage 3</button>
        <button onClick={() => setIsSubmitted(!isSubmitted)}>Toggle is isSubmitted</button>

        {stage && <FeatureForm className={styles['feature-form']} test={1} onValues={handleValues} feature={stage} onError={handleError} isSubmitted={isSubmitted} />}
    </div>
}

export default FeatureFormPreview;