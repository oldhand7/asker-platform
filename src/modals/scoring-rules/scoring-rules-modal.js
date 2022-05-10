import Modal from 'components/Modal/Modal';
import ScoringRulesForm from 'forms/scoring-rules/scoring-rules-form';

import styles from './scoring-rules-modal.module.scss';

const ScoringRulesModal = ({ onResult, type, values, criteria, ...props }) => {
  return <Modal id="scoring-rules-modal" {...props} className={`${styles['modal']}`}>
    <ScoringRulesForm values={values} criteria={criteria} onValues={val => onResult(val, true)} />
  </Modal>
}

export default ScoringRulesModal;
