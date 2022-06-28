import classNames from "classnames"
import CriteriaRating from "components/CriteriaRating/CriteriaRating"
import { COLOR_MAP } from "libs/config";

import styles from './EvaluationCriteriaList.module.scss';

const EvaluationCriteriaList = ({ className, evaluation }) => {
    return <ul className={classNames(
        styles['evaluation-criteria-list'],
        className
    )}>
    {evaluation.children.map(c => {
      return <li key={c.id} data-test-id="interview-evaluation" className={styles['evaluation-criteria-list-item']}>
        <span className={styles['evaluation-criteria-list-criteria']}>
          {c.name}
        </span>
        <CriteriaRating className={styles['evaluation-criteria-list-score']} value={c.score} color={COLOR_MAP[evaluation.type]} />
      </li>
    })}
    </ul>
}

export default EvaluationCriteriaList;