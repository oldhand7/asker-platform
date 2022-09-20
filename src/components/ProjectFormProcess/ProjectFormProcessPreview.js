import { useState } from 'react';
import ProjectFormProcess from './ProjectFormProcess';

import styles from './ProjectFormProcessPreview.module.scss';

const ProjectFormProcessPreview = () => {
    const [mode, setMode] = useState('stage-control')
    const [stages, setStages] = useState([])
    const [stage, setStage] = useState(null);

    return <div>
        <div>
            <button onClick={() => setMode('stage-control')}>Set control mode</button>
            <button onClick={() => setMode('stage-choose')}>Set choose mode</button>
        </div>
        <ProjectFormProcess className={styles['project-form-process']} mode={mode} stages={stages} stage={stage} onStage={setStage} onChange={setStages} />
    </div>
}

export default ProjectFormProcessPreview;