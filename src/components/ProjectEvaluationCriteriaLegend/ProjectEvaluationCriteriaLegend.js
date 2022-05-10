import { projectStageQuestionsReducer, getSubtype } from 'libs/helper';
import { COLOR_MAP } from 'libs/config';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from './ProjectEvaluationCriteriaLegend.module.scss';

const ProjectEvaluationCriteriaLegend = ({ className, criteria, scoringRules = {}, onRules }) => {
  return <div className={classNames(styles['project-evaluation-criteria-legend'], className)}>
    {criteria.map((c, index) => (
      <div key={c.name} style={{ color: COLOR_MAP[c.id || c.type] ? COLOR_MAP[c.id || c.type] : '#CCC' }} className={styles['project-evaluation-criteria-legend-item']}>
        <span className={styles['project-evaluation-criteria-legend-item-label']}>{c.weight}% {c.name}</span>
      </div>))}
  </div>
}

export default ProjectEvaluationCriteriaLegend;
