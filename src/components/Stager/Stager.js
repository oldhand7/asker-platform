import classNames from 'classnames';

import styles from './Stager.module.scss';

const dummyStages = [
  { name: 'Introduction', type: '' },
  { name: 'Competency', type: 'green' },
  { name: 'Company', type: 'mustard' },
  { name: 'Summary', type: '' }
]

const Stager = ({ className, stages = dummyStages }) => {

  return <div className={classNames(styles['stager'], className)}>
    {stages.filter(s => s).map((stage, index) => <div data-test-id="stage" key={`stage${index}`} className={classNames(styles['stager-item'], styles[`stager-item-${stage.type}`])}>
      <span className={styles['stager-item-label']}>{stage.name}</span>
      <span className={styles['stager-item-number']}>{index+1}</span>
    </div>)}
  </div>
}

export default Stager;
