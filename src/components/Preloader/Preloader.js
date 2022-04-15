import classNames from 'classnames';
import { useState, useEffect } from 'react';

import styles from './Preloader.module.scss';

import PreloaderGif from './assets/images/loading.gif';

const Preloader = ({ className}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true);
  }, [show])

  //@TODO: https://codepen.io/jonitrythall/pen/ojKgdx
  return show ? <div className={classNames(styles['preloader'], className)}>
    <img className={styles['preloader-image']} src={PreloaderGif.src} alt="" />
  </div> : null
}

export default Preloader;
