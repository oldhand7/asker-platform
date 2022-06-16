import { projectStageQuestionsReducer, getSubtype } from 'libs/helper';
import { COLOR_MAP } from 'libs/config';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import CriteriaLegend from 'components/CriteriaLegend/CriteriaLegend'

import styles from './ProjectEvaluationCriteriaLegend.module.scss';

const ProjectEvaluationCriteriaLegend = ({ className, criteria, scoringRules = {}, onRules }) => {
  return <div className={classNames(styles['project-evaluation-criteria-legend'], className)}>
    {criteria.map(c => (
      <CriteriaLegend key={c.type} criteria={c} className={styles['project-evaluation-criteria-legend-item']} />
    ))}
  </div>
}

export default ProjectEvaluationCriteriaLegend;
