import classNames from 'classnames';
import MemberCard from 'components/MemberCard/MemberCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import styles from './TeamCarousel.module.scss';

const breakpoints = {
  768: {
    perPage: 1,
  }
}

const TeamCarousel = ({ className, team = [] }) => {
  return <div className={classNames(styles['team-carousel'], className)}>
    <div className={classNames(styles['team-carousel-inner'], className)}>
      <Splide options={{ breakpoints, perPage: 3, height: '550px', type: 'loop', width: '100%', focus: 'center', arrows: (typeof window !== 'undefined' && window.innerWidth <= 1024) || team.length > 3, pagination: false}}>
      {
        team.map(member => <SplideSlide key={member.name}  className={styles['team-carousel-slide']}>
          <MemberCard className={styles['team-carousel-member']} member={member} />
        </SplideSlide>)
      }
      </Splide>
    </div>
  </div>
}

export default TeamCarousel;
