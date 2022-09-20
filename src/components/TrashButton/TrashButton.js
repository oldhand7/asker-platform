import TrashIcon from 'components/Icon/TrashIcon';
import IconButton from 'components/IconButton/IconButton';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { useTranslation } from 'libs/translation';

import styles from './TrashButton.module.scss';

const TrashButton = ({ className, title, ...props }, ref) => {
  const { t } = useTranslation();

  return <IconButton title={typeof title === "undefined" ? t('actions.delete') : title} ref={ref} data-test-id="trash-button" className={classNames(styles['trash-button'], className)} Icon={TrashIcon} {...props} />
}

export default forwardRef(TrashButton);
