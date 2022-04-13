import classNames from 'classnames';

import styles from './CandidateCard.module.scss';

const getInitials = name => {
  return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
}

const CandidateCard = ({ className, candidate }) => {

  return <div className={classNames(styles['candidate-card'], className)}>
    <div className={styles['candidate-card-initials']}>{getInitials(candidate.name)}</div>
    <div className={styles['candidate-card-name']}>{candidate.name}</div>
  </div>
}

export default CandidateCard;
