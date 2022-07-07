import classNames from 'classnames';
import { SHORT_NAMES } from 'libs/stage'

import styles from './Stager.module.scss';

const dummyStages = [
  { name: 'Introduction', type: '' },
  { name: 'Competency', type: 'green' },
  { name: 'Company', type: 'mustard' },
  { name: 'Summary', type: '' }
]

const Stager = ({ className, stages = dummyStages }) => {

  return <div className={classNames(styles['stager'], className)}>
    <div className={styles['stager-inner']}>
      {stages.filter(s => s).map((stage, index) => <div data-test-id="stage" key={`stage${index}`} className={classNames(styles['stager-item'], styles[`stager-item-${stage.type}`])}>
        <span className={styles['stager-item-label']}>{SHORT_NAMES[stage.id] || stage.shortName || stage.name}</span>
        <span className={styles['stager-item-circle']}>
          <span className={styles['stager-item-value']}>{index+1}</span>
        </span>
      </div>)}
    </div>
  </div>
}

export default Stager;
