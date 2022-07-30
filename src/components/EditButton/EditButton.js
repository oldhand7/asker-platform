import EditField from 'components/Icon/EditFieldIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton';
import { forwardRef} from 'react';

import styles from './EditButton.module.scss';
import { useSite } from 'libs/site';

const EditButton = ({ className, ...props }, ref) => {
  const { t }  = useSite();

  return <IconButton title={t("Edit")} ref={ref} data-test-id="edit-button" className={classNames(styles['trash-button'], className)} Icon={EditField} {...props}/>
}

export default forwardRef(EditButton);
