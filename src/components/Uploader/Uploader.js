import UploaderRC from 'rc-upload';
import classNames from 'classnames';

import styles from './Uploader.module.scss';

const Uploader = (props) => {
  const {
    className,
    ...restProps
  } = props;

  return <div className={styles['uploader-wrapper']}>
    <UploaderRC {...restProps} className={classNames(styles['uploader'], props.className)}  />
  </div>
}

export default Uploader;
