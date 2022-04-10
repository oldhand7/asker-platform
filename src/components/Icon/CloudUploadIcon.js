import CloudUploadSvg from './assets/icons/cloud-upload.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CloudUpload = ({ className }) => <CloudUploadSvg className={classNames(styles['icon'], styles['icon-cloud-upload'], className)} />;

export default CloudUpload;
