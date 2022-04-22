import classNames from 'classnames';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

import styles from './ProjectEvaluationCriteria.module.scss';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#43B88C', '#1E453E', '#E5C673'];

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
      const { criteria } = questions[i];

      if (!criteria) {
        continue;
      }

      if (!criterias[criteria.id]) {
        criterias[criteria.id] = {
          ...criteria,
          count: 0
        }
      }

      criterias[criteria.id].count++
    }

    let criterias2 = Object.values(criterias)

    criterias2.sort(function(ca, cb) {
      if (ca.count < cb.count) return -1;
      if (ca.count > cb.count) return 1;

      return 0;
    });

    setCriteria(criterias2.reverse().slice(0, 3).map(c => (
      { ...c, p: Math.round(c.count * 100 / Mat.max(3, criterias2.length)) }
    )))
  }, [project])

  return criteria.length ? <div className={classNames(styles['project-evaluation-criteria'], className)}>
  <h2 className={styles['project-evaluation-criteria-title']}>Evaluation Criteria</h2>
  <PieChart className={styles['project-evaluation-criteria-chart']} width={500} height={250} >
         <Pie
           data={criteria}
           innerRadius={70}
           outerRadius={100}
           fill="#8884d8"
           paddingAngle={1}
           dataKey="p"
         >
           {criteria.map((c, index) => (
             <Cell key={`cell-${c.id}`} fill={COLORS[index % COLORS.length]} />
           ))}
         </Pie>
       </PieChart>
      <div className={styles['project-evaluation-criteria-legend']}>
        {criteria.map((c, index) => <div style={{ color: COLORS[index % COLORS.length] }} className={styles['project-evaluation-criteria-legend-item']} key={c.id}>
          <span className={styles['project-evaluation-criteria-legend-item-label']}>{c.p}% {c.name}</span>
          </div>)}
      </div>
  </div> : null
}

export default ProjectEvaluationCriteria;
