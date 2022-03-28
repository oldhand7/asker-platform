import classNames from 'classnames';
import UpsellCard from 'components/UpsellCard/UpsellCard';
import Icon from 'components/Icon/Icon';
import Link from 'next/link';
import QuoteSvg from './assets/icons/Group.svg'
import BubbleSvg from './assets/icons/carbon_chart-bubble.svg'
import ChartSvg from './assets/icons/uil_arrow-growth.svg'
import ArrowSvg from './assets/icons/fi-rr-arrow-small-right.svg'
import striptags from 'striptags';

import styles from './upsell-section.module.scss';

const UpsellSection = ({ className, section, cards }) => {
  return <div className={classNames(styles['upsell-section'], className)}>
    <div className={styles['upsell-section-inner']}>
      <h2 className={styles['upsell-section-title']}>{section && section.title.en}</h2>

      <div className={styles['upsell-section-cards']}>
        <UpsellCard icon={<QuoteSvg />} className={styles['upsell-section-card']} title={cards && cards[0].title.en} desc={striptags(cards && cards[0].content.en)} />
        <UpsellCard icon={<BubbleSvg />} className={styles['upsell-section-card']} title={cards && cards[1].title.en} desc={striptags(cards && cards[1].content.en)} />
        <UpsellCard icon={<ChartSvg />} className={styles['upsell-section-card']} title={cards && cards[2].title.en} desc={striptags(cards && cards[2].content.en)} />
        <div className={styles['upsell-section-link-container']}>
          <Link href={section && section.cta.link}>
            <a className={styles['upsell-section-cta']}>
              <span>{section && section.cta.text.en}</span>
              <Icon className={styles['upsell-section-cta-icon']} icon={<ArrowSvg />} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  </div>
}

export default UpsellSection;
