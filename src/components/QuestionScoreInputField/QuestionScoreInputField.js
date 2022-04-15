import RuleInputField from 'components/RuleInputField/RuleInputField';
import classNames from 'classnames';

import styles from './QuestionScoreInputField.module.scss'

const QuestionScoreInputField = ({ className='', rules = [], onChange }) => {
  const handleRulesChange = (val, index) => {
    const newRules = [
        ...rules
    ]

    newRules[index] = val;

    onChange([
      ...newRules
    ])
  }

  return <div className={classNames(styles['question-score-input-field'], className)}>
    <span className={styles['question-score-input-field-label']}>Score</span>

    <ul className={styles['question-score-input-field-rules']}>
      {rules.map((rule, index) => <li className={styles['question-score-input-field-rules-item']} key={index}>
        <RuleInputField index={index + 1} rule={rule} onChange={val => handleRulesChange(val, index)} className={styles['question-score-input-field-rules-input']} />
      </li>)}
    </ul>
  </div>
}

export default QuestionScoreInputField;
