import classNames from 'classnames';

import styles from './FeatureLabel.module.scss';

const FeatureLabel = ({ index = 0, onClick, className, feature }) => {
  return <span
    data-test-id={`feature-${feature.id}`}
    onClick={() => onClick && onClick(feature)}
    className={classNames(
      styles['feature-label'],
      className,
      styles[`feature-label-${feature.type}`])}>
    {feature.name}
    </span>
}

export default FeatureLabel;
