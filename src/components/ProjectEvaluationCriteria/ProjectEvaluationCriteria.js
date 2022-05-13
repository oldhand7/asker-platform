import classNames from 'classnames';
import { PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { ucFirst, projectStageQuestionsReducer } from 'libs/helper';
import { getSubtype } from 'libs/helper';
import { COLOR_MAP } from 'libs/config';
import ProjectEvaluationCriteriaLegend from 'components/ProjectEvaluationCriteriaLegend/ProjectEvaluationCriteriaLegend';
import styles from './ProjectEvaluationCriteria.module.scss';
import EditButton from 'components/EditButton/EditButton'
import ScoringRulesModal from 'modals/scoring-rules/scoring-rules-modal';
import { useModal } from 'libs/modal';
import { getProjectEvaluationCriterias } from 'libs/project'

const ajusted = (criteria, scoringRules) => {
  return criteria.map(c => {
    const altWeight = (scoringRules || {})[c.type || c.id];

    if (scoringRules && scoringRules[c.type || c.id]) {
      return {
        ...c,
        weight: fixWeight(altWeight)
      }
    }

    return criteria
  })
}

const ProjectEvaluationCriteria = ({ className, project, onScoringRules }) => {
  const [criteria, setCriteria] = useState([]);
  const [error, setError] = useState(null);
  const openScoreAdjustmentModal = useModal(ScoringRulesModal, { values: project.scoringRules, criteria })

  useEffect(() => {
    setCriteria(getProjectEvaluationCriterias(project))
  }, [project])

  useEffect(() => {
    const sum = criteria.reduce((s, c) => Number.parseFloat(c.weight) + s, 0)

    if (Math.round(sum) != 100) {
      setError(true)
    } else {
      setError(false)
    }
  }, [criteria, project])

  return criteria.length ? <div data-testid="project-evaluation-criteria" className={classNames(styles['project-evaluation-criteria'], className)}>
  <h2 className={styles['project-evaluation-criteria-title']}>Evaluation Criteria</h2>

  <PieChart className={styles['project-evaluation-criteria-chart']} width={500} height={250} >
    <Pie
      data={criteria}
      innerRadius={70}
      outerRadius={100}
      fill="#8884d8"
      paddingAngle={criteria.length == 1 ? 0 : 2}
           dataKey="weight"
           stroke=''
         >
           {criteria.map((c, index) => (
             <Cell key={`cell-${c.id}`} fill={COLOR_MAP[c.type] ? COLOR_MAP[c.type] : '#CCC'} />
           ))}
         </Pie>
       </PieChart>
      <ProjectEvaluationCriteriaLegend className={styles['project-evaluation-criteria-legend']} criteria={criteria} />
      {error ? <p className="form-error">Criteria unbalanced!</p> : null}
      {onScoringRules ? <EditButton text='Edit' className={styles['project-evaluation-criteria-edit']} onClick={() => openScoreAdjustmentModal(onScoringRules)} /> : null}
  </div> : null
}

export default ProjectEvaluationCriteria;
