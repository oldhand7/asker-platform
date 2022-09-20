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
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

const ProjectEvaluationCriteria = ({ className, project, onScoringRules }) => {
  const [error, setError] = useState(null);
  const { t, i18nField } = useTranslation();
  const openScoringRulesModal = useModal(ScoringRulesModal)
  const { locale } = useRouter();

  const criterias = useMemo(
    () => getProjectEvaluationCriterias(project, { t, i18nField }),
    [project, locale]
    )

  useEffect(() => {
    const sum = criterias.reduce((s, c) => Number.parseFloat(c.weight) + s, 0)

    if (Math.round(sum) != 100) {
      setError(true)
    } else {
      setError(false)
    }
  }, [criterias])

  const handleOpenScoringEditor = () => {
      openScoringRulesModal(
        onScoringRules,
        {
          values: project.scoringRules,
          criteria: criterias
        }
      )
  }

  return criterias.length ? <div data-test-id="project-evaluation-criteria" className={classNames(styles['project-evaluation-criteria'], className)}>

  <div className={styles['project-evaluation-criteria-head']}>
    <h2 className={styles['project-evaluation-criteria-title']}>{t('headings.evaluation-criteria')}</h2>
    {onScoringRules ? <EditButtonLabeled text='' className={styles['project-evaluation-criteria-edit']} onClick={handleOpenScoringEditor} /> : null}
  </div>

  {error && <p className="form-error" style={{ textAlign: 'left'}}>{t('warnings.criteria-unbalanced')}</p>}

  <PieChart id={1} className={styles['project-evaluation-criteria-chart']} width={140} height={140} >
    <Pie
      data={criterias}
      innerRadius={60}
      outerRadius={70}
      startAngle={90}
      endAngle={450}
      cornerRadius={15}
      fill="#8884d8"
      paddingAngle={criterias.length == 1 ? 0 : 2}
           dataKey="weight"
           stroke=''
         >
           {criterias.map((c, index) => (
             <Cell key={`${locale}-cell-${c.id}`} fill={COLOR_MAP[c.type] ? COLOR_MAP[c.type] : '#CCC'} />
           ))}
         </Pie>
       </PieChart>
      <ProjectEvaluationCriteriaLegend className={styles['project-evaluation-criteria-legend']} criteria={criterias} />
  </div> : null
}

export default ProjectEvaluationCriteria;
