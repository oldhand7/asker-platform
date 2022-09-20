import { features } from "libs/features";
import { useState } from "react";
import StageTreeLeaf from "./StageTreeLeaf";
import TrashIcon from "components/Icon/TrashIcon";
import MailIcon from "components/Icon/MailIcon"; 

import styles from './StageTreeLeafPreview.module.scss'

const StageTreeLeafPreview = () => {
    const [error, setError] = useState(null)
    const [active, setActive] = useState(false)

    const addQuestion = () => {
        const { config } = stage;

        setStage({
            ...stage,
            config: {
                ...config,
                questions: [
                    ...config.questions,
                    'q'
                ]
            }
        })
    }

    return <div>
        <div className={styles['stage-tree-leaf-preview']}>
            <h2># No props</h2>
            <StageTreeLeaf />
        </div>

        <div className={styles['stage-tree-leaf-preview']}>
            <h2># Custom configuration inactive</h2>

            <div className={styles['stage-tree-leaf-controls']}>
                <button onClick={() => setError(error ? null : new Error('Some problems here!'))}>toggle error</button>
                <button onClick={() => setActive(!active)}>toggle active</button>
                <button onClick={addQuestion}>+1 question</button>
            </div>
    
            <StageTreeLeaf Icon={MailIcon} onClick={() => setActive(!active)} actions={[{id: 'delete', name: 'Delete'}]} onAction={(a) => alert('action' + a.id)} error={error} active={active} className={styles['stage-tree-leaf']} />
        </div>


        <div className={styles['stage-tree-leaf-preview']}>
            <h2># All features</h2>

            {features.map(feature => (
                <StageTreeLeaf key={feature.id} Icon={TrashIcon} label={feature.name} time='12' className={styles['stage-tree-leaf']} />
            ))}
        </div>
    </div>
}

export default StageTreeLeafPreview;