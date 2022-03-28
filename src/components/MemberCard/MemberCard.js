
import classNames from 'classnames';
import Link from 'next/link';
import LinkedinIcon from 'components/Icon/LinkedinIcon';
import GithubIcon from 'components/Icon/GithubIcon';
import FacebookIcon from 'components/Icon/FacebookIcon';
import MailIcon from 'components/Icon/MailIcon';

import styles from './MemberCard.module.scss';

const typeIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  mail: MailIcon
}

const typeIcon = t => {
  const Comp = typeIcons[t]

  return <Comp className={styles['member-card-links-icon']} />
}

const MemberCard = ({ className, member }) => {
  return <div className={classNames(styles['member-card'], className)}>
    {
      member.avatar ?
      <img src={member.avatar} className={styles['member-card-avatar']} /> :
      null
    }

    <h4 className={styles['member-card-title']}>{member.name['en']}</h4>
    <p className={styles['member-card-subtitle']}>{member.position['en']}</p>

    {
      member.links && member.links.length ?
      <ul className={styles['member-card-links']}>
        {member.links.map(link => {
          return <li key={link.type} className={styles['member-card-links-item']}>
          <Link href={link.url}><a target="_blank" className={styles['member-card-links-link']}>{typeIcon(link.type)}</a></Link></li>
        })}
      </ul> : null
    }
  </div>
}

export default MemberCard;
