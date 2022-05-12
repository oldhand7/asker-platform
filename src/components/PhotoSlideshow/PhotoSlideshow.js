import classNames from 'classnames';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import styles from './PhotoSlideshow.module.scss';

const defaultOptions = {
  perPage: 1,
  height: '500px',
  type: 'slide',
  width: '100%',
  arrows: false
}

const PhotoSlideshow = ({ className, images = [], options={} }) => {
  const commonOptions = {
    ...defaultOptions,
    ...options
  }

  return <Splide className={classNames(styles['photo-slideshow'], className)} options={commonOptions}>
      {
        images.map((image, index) => (
          <SplideSlide key={index}  className={styles['photo-slideshow-slide']}>
          <img alt="" src={image} title="" className={styles['photo-slideshow-image']} />
        </SplideSlide>))
      }
      </Splide>
}

export default PhotoSlideshow;
