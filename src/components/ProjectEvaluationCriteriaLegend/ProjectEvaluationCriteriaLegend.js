import classNames from 'classnames';
import CriteriaLegend from 'components/CriteriaLegend/CriteriaLegend'

import styles from './ProjectEvaluationCriteriaLegend.module.scss';

const ProjectEvaluationCriteriaLegend = ({ className, criteria }) => {
  return <div className={classNames(styles['project-evaluation-criteria-legend'], className)}>
    {criteria.map(c => (
      <CriteriaLegend key={c.type} criteria={c} className={styles['project-evaluation-criteria-legend-item']} />
    ))}
  </div>
}

export default ProjectEvaluationCriteriaLegend;
