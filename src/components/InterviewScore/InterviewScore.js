import classNames from 'classnames';
import { PieChart, Pie, Cell } from 'recharts';
import colorBetween from 'color-between';

import styles from './InterviewScore.module.scss';

const getColor = (score) => {
  if (score < 25) {
    return '#E77272';
  }

  if (score < 50) {
    return '#DFD049';
  }

  return colorBetween('#9AE23E', '#43B88C', score / 100, 'hex');
}

const CandidateScore = ({ className, score = 0 }) => {
  return <div className={classNames(styles['interview-score'], className)}>
    <PieChart width={100} height={100} >
          <Pie
            data={[
              { name: '', value: 100-score },
              { name: 'Score', value: score }
            ]}
            innerRadius={42}
            outerRadius={50}
            fill="#8884d8"
            paddingAngle={false}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            isAnimationActive={false}
            blendStroke
          >
            <Cell key={`cell`} fill={'#DCDCDC'} />
            <Cell key={`cell-score`} fill={getColor(score)} />
          </Pie>
        </PieChart>
        <span className={styles['interview-score-value']}>{score}%</span>
  </div>
}

export default CandidateScore;
