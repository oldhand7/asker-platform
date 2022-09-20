const { default: ProjectStageChoose } = require("./ProjectStageChoose")
import { useState } from 'react';

import styles from './ProjectStageChoosePreview.module.scss';

const ProjectStageChoosePreview = () => {
    const [choice, setChoice] = useState(null);

    return <div>
        <h2>Choose: {choice && choice.id || '-'}</h2>
        <ProjectStageChoose className={styles['project-stage-choose']} onChoose={setChoice} onClose={() => alert('Closing')} />
    </div>
}

export default ProjectStageChoosePreview;