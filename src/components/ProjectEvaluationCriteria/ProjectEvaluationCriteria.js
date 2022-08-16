import classNames from 'classnames';
import { PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { COLOR_MAP } from 'libs/config';
import ProjectEvaluationCriteriaLegend from 'components/ProjectEvaluationCriteriaLegend/ProjectEvaluationCriteriaLegend';
import styles from './ProjectEvaluationCriteria.module.scss';
import EditButtonLabeled from 'components/EditButtonLabeled/EditButtonLabeled'
import ScoringRulesModal from 'modals/scoring-rules/scoring-rules-modal';
import { useModal } from 'libs/modal';
import { getProjectEvaluationCriterias } from 'libs/project'
import ExclamationIcon from 'components/Icon/ExclamationIcon';
import Tooltip from 'components/Tooltip/Tooltip';
import { useSite } from 'libs/site';

const ProjectEvaluationCriteria = ({ className, project, onScoringRules }) => {
  const [criteria, setCriteria] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useSite();
  const openScoringRulesModal = useModal(
    ScoringRulesModal, { values: project.scoringRules, criteria })

  useEffect(() => {
    const criteria = getProjectEvaluationCriterias(project, t);

    setCriteria(criteria)
  }, [project, ])

  useEffect(() => {
    const sum = criteria.reduce((s, c) => Number.parseFloat(c.weight) + s, 0)

    if (Math.round(sum) != 100) {
      setError(true)
    } else {
      setError(false)
    }
  }, [criteria, project])

  return criteria.length ? <div data-test-id="project-evaluation-criteria" className={classNames(styles['project-evaluation-criteria'], className)}>

  <div className={styles['project-evaluation-criteria-head']}>
  <h2 className={styles['project-evaluation-criteria-title']}>{t('Evaluation criteria')} {error ? <Tooltip text={t('Criteria unbalanced!')}>{ref => <span className={styles['project-evaluation-criteria-title-warning']} ref={ref} ><ExclamationIcon /></span>}</Tooltip> : null}</h2>
  {onScoringRules ? <EditButtonLabeled text='Edit' className={styles['project-evaluation-criteria-edit']} onClick={() => openScoringRulesModal(onScoringRules)} /> : null}
  </div>

  <PieChart id={1} className={styles['project-evaluation-criteria-chart']} width={140} height={140} >
    <Pie
      data={criteria}
      innerRadius={60}
      outerRadius={70}
      startAngle={90}
      endAngle={450}
      cornerRadius={15}
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
  </div> : null
}

export default ProjectEvaluationCriteria;
