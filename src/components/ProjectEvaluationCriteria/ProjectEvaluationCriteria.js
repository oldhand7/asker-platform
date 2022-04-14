import classNames from 'classnames';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

import styles from './ProjectEvaluationCriteria.module.scss';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProjectEvaluationCriteria = ({ className, project }) => {

  return <div className={classNames(styles['project-evaluation-criteria'], className)}>
  <h2 className={styles['project-evaluation-criteria-title']}>Evaluation Criteria</h2>
  <PieChart className={styles['project-evaluation-criteria-chart']} width={500} height={250} >
         <Pie
           data={data}
           innerRadius={70}
           outerRadius={100}
           fill="#8884d8"
           paddingAngle={1}
           dataKey="value"
         >
           {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
           ))}
         </Pie>
       </PieChart>
      <div className={styles['project-evaluation-criteria-legend']}>
        {COLORS.map(color => <div style={{ color }} className={styles['project-evaluation-criteria-legend-item']} key={color}>
          <span className={styles['project-evaluation-criteria-legend-item-label']}>{color}</span>
          </div>)}
      </div>
  </div>
}

export default ProjectEvaluationCriteria;
