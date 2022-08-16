import TrashIcon from 'components/Icon/TrashIcon';
import IconButton from 'components/IconButton/IconButton';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { useSite } from 'libs/site';

import styles from './TrashButton.module.scss';

const TrashButton = ({ className, ...props }, ref) => {
  const { t } = useSite();

  return <IconButton title={t("Delete")} ref={ref} data-test-id="trash-button" className={classNames(styles['trash-button'], className)} Icon={TrashIcon} {...props} />
}

export default forwardRef(TrashButton);
