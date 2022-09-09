import { useCallback, useEffect, useMemo, useState } from "react"
import ProjectStageTree from './ProjectStageTree';

import styles from './ProjectStageTreePreview.module.scss'

const dummyStages = [
    { id: 'introduction', config: { time: 11 } },
    { id: 'competency-questions', config: { time: 22, questions: [{ id: 'q1', name: 'Q1', criteria: { id: 'c1', name: 'C1'}}] } },
    { id: 'screening-questions', config: { time: 33, questions: [{id: 'q2', name: 'Q1'}, {id: 'q2', name: 'Q2'}] } },
    { id: 'summary', config: { time: 44 } }
]

const ProjectStageTreePreview = () => {
    const [stage, setStage] = useState(null);
    const [stages, setStages] = useState(dummyStages);

    const cachedStages = useMemo(() => stages, [stages])


    return <ProjectStageTree stage={stage} stages={cachedStages} onChange={setStages} onStage={setStage} className={styles['project-stage-tree']} />
}

export default ProjectStageTreePreview;