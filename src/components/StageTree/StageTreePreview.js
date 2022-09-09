const { default: StageTree } = require("./StageTree")

import styles from './StageTreePreview.module.scss';

const StageTreePreview = () => {
    const stages = [
        {
            id: 'introduction',
            config: {
                time: 111
            }
        },
        {
            id: 'competency-questions',
            config: {
                questions: [
                    { id: 'cq1', name: 'Just some C1 question', criteria: { id: 'c1', name: 'A' } },
                    { id: 'cq2', name: 'Just some C2 question', criteria: { id: 'c2', name: 'Z' }  },
                    { id: 'cq3', name: 'Yet another C2 question', criteria: { id: 'c2', name: 'Z' }  }
                ],
                time: 222
            }
        },
        {
            id: 'screening-questions',
            config: {
                questions: [
                    { id: 'sq1', name: 'Just some screening question A' },
                    { id: 'sq2', name: 'Just some screening question B' },
                    { id: 'sq3', name: 'Just some screening question C' }
                ],
                time: 333
            }
        }
    ]

    return <div>
        <StageTree className={styles['stage-tree']} stage={stages[0]} onDelete={() => alert('Deleting')} />
        <StageTree className={styles['stage-tree']} stage={stages[1]} onDelete={() => alert('Deleting')} />
    </div>
}

export default StageTreePreview;