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

const weightVal = val => Number.parseFloat((val * 100).toFixed(2))

const ajusted = (criteria, scoringRules) => {

  return criteria.map(c => {
    const altWeight = (scoringRules || {})[c.type || c.id];

    return {
      ...c,
      weight: typeof altWeight !== "undefined" ? Number.parseFloat(altWeight) : c.weight
    }
  })
}

const ProjectEvaluationCriteria = ({ className, project, onScoringRules }) => {
  const [criteria, setCriteria] = useState([]);
  const [error, setError] = useState(null);
  const openScoreAdjustmentModal = useModal(ScoringRulesModal, { values: project.scoringRules, criteria })

  useEffect(() => {
    const { config, scoringRules } = project;

    const questions = Object.values(config)
      .reduce(projectStageQuestionsReducer, [])

    const competencyQuestions = questions.filter(q => getSubtype(q) == 'competency')
    const experienceQuestions = questions.filter(q => getSubtype(q) == 'experience')
    const hardSkillQuestions = questions.filter(q => getSubtype(q) == 'hard-skill')
    const motivationQuestions = questions.filter(q => getSubtype(q) == 'motivation')
    const cultureFitQuestions = questions.filter(q => getSubtype(q) == 'culture-fit')
    const screeningQuestions = questions.filter(q => q.type == 'screening')
    const otherQuestions = questions.filter(q => q.type == 'other')

    const criteriaAgregate = {
      competency: {},
      experience: {}
    }

    const mixedQuestions = [
      ...competencyQuestions,
      ...experienceQuestions
    ]

    for (let i = 0; i < mixedQuestions.length; i++) {
      const key = mixedQuestions[i].criteria.id;
      const type = getSubtype(mixedQuestions[i])

      if (!criteriaAgregate[type][key]) {
        criteriaAgregate[type][key] = 1

        criteriaAgregate[type][key] = {
          id: key,
          name: mixedQuestions[i].criteria.name,
          count: 1,
          type
        }
      } else {
        criteriaAgregate[type][key].count++
      }
    }

    const criteria = [
        ...Object.values(criteriaAgregate.competency),
        ...Object.values(criteriaAgregate.experience)
      ].map(c => ({
        ...c,
        weight: scoringRules && Number.parseFloat(scoringRules[c.id]) || weightVal(c.count / questions.length)
      }))

    if (hardSkillQuestions.length) {
      criteria.push({
        name: 'Hard-skill',
        weight: scoringRules && Number.parseFloat(scoringRules['hard-skill']) || weightVal(hardSkillQuestions.length / questions.length),
        type: 'hard-skill'
      })
    }

    if (motivationQuestions.length) {
      criteria.push({
        name: 'Motivation',
        weight: scoringRules && Number.parseFloat(scoringRules['motivation']) || weightVal(motivationQuestions.length / questions.length),
        type: 'motivation'
      })
    }

    if (cultureFitQuestions.length) {
      criteria.push({
        name: 'Culture-fit',
        weight: scoringRules && Number.parseFloat(scoringRules['culture-fit']) || weightVal(cultureFitQuestions.length / questions.length),
        type: 'culture-fit'
      })
    }

    if (screeningQuestions.length) {
      criteria.push({
        name: 'Screening',
        weight: scoringRules && Number.parseFloat(scoringRules['screening']) || weightVal(screeningQuestions.length / questions.length),
        type: 'screening'
      })
    }

    if (otherQuestions.length) {
      criteria.push({
        name: 'Other',
        weight: scoringRules && Number.parseFloat(scoringRules['other']) || weightVal(otherQuestions.length / questions.length),
        type: 'other'
      })
    }

    criteria.sort(function(ca, cb) {
      if (ca.weight < cb.weight) return 1;
      if (ca.weight > cb.weight) return -1;

      return 0;
    });

    setCriteria(criteria)
  }, [project])

  useEffect(() => {
    const sum = ajusted(criteria, project.scoringRules).reduce((s, c) => Number.parseFloat(c.weight) + s, 0)

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
      data={ajusted(criteria, project.scoringRules)}
      innerRadius={70}
      outerRadius={100}
      fill="#8884d8"
      paddingAngle={0}
           dataKey="weight"
           stroke=''
         >
           {criteria.map((c, index) => (
             <Cell key={`cell-${c.id}`} fill={COLOR_MAP[c.type] ? COLOR_MAP[c.type] : '#CCC'} />
           ))}
         </Pie>
       </PieChart>
      <ProjectEvaluationCriteriaLegend className={styles['project-evaluation-criteria-legend']} criteria={ajusted(criteria, project.scoringRules)} />
      {error ? <p className="form-error">Criteria unbalanced!</p> : null}
      {onScoringRules ? <EditButton text='Edit' className={styles['project-evaluation-criteria-edit']} onClick={() => openScoreAdjustmentModal(onScoringRules)} /> : null}
  </div> : null
}

export default ProjectEvaluationCriteria;
