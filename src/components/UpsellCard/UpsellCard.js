import classNames from 'classnames';
import Icon from 'components/Icon/Icon';

import styles from './UpsellCard.module.scss';

const UpsellCard = ({ className, icon, children, title='(title missing)', desc = '...' }) => {

  return <div className={classNames(styles['upsell-card'], className)}>
    {
      icon ?
      <Icon icon={icon} className={styles['upsell-card-icon']} /> :
      null
    }
    <h3 className={styles['upsell-card-title']}>{title}</h3>
    <p className={styles['upsell-card-desc']}>{children && children.length ? children : desc}</p>
  </div>
}

export default UpsellCard;
