import classNames from 'classnames';
import { PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { ucFirst } from 'libs/helper';
import { getSubtype } from 'libs/helper';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';

import styles from './ProjectEvaluationCriteria.module.scss';

const COLORS = [
  '#43B88C', '#1E453E', '#E5C673',
  '#D74E96', '#FF915D', '#D8F75A',
  '#3EABA3', '#FFD95D', '#4ACC61'
];

const ProjectEvaluationCriteria = ({ className, project }) => {
  const [criteria, setCriteria] = useState([]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const questions = Object.values(project.config).reduce((questions, stage) => {
      return [
        ...questions,
        ...(stage.questions ? stage.questions : [])
      ]
    }, [])

    const criterias = {}
    let criteriaMax = 0;

    for (let i = 0; i < questions.length; i++) {
      const { criteria, subtype, type } = questions[i];

      let id;

      if (type == 'screening' || type == 'other') {
        id = type
      } else if (
        EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(getSubtype(questions[i])) > -1) {
        id = subtype
      } else {
        id = criteria.id
      }

      if (!id) {
        continue;
      }

      if (!criterias[id]) {
        criterias[id] = {
          name: criteria ? criteria.name : ucFirst(id),
          count: 0
        }
      }

      criterias[id].count++
    }

    let criterias2 = Object.values(criterias)

    criterias2.sort(function(ca, cb) {
      if (ca.count < cb.count) return -1;
      if (ca.count > cb.count) return 1;

      return 0;
    });

    setCriteria(criterias2.reverse().map(c => (
      { ...c, p: Math.min(Math.round(c.count * 100 / questions.length), 100) }
    )))
  }, [project])

  return criteria.length ? <div data-testid="project-evaluation-criteria" className={classNames(styles['project-evaluation-criteria'], className)}>
  <h2 className={styles['project-evaluation-criteria-title']}>Evaluation Criteria</h2>
  <PieChart className={styles['project-evaluation-criteria-chart']} width={500} height={250} >
         <Pie
           data={criteria}
           innerRadius={70}
           outerRadius={100}
           fill="#8884d8"
           paddingAngle={0}
           dataKey="p"
           stroke=''
         >
           {criteria.map((c, index) => (
             <Cell key={`cell-${c.id}`} fill={COLORS[index % COLORS.length]} />
           ))}
         </Pie>
       </PieChart>
      <div className={styles['project-evaluation-criteria-legend']}>
        {criteria.map((c, index) => (
          <div key={c.name} style={{ color: COLORS[index % COLORS.length] }} className={styles['project-evaluation-criteria-legend-item']}>
            <span className={styles['project-evaluation-criteria-legend-item-label']}>{c.p}% {c.name}</span>
          </div>))}
      </div>
  </div> : null
}

export default ProjectEvaluationCriteria;
