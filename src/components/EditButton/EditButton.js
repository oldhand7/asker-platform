import EditField from 'components/Icon/EditFieldIcon';
import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton';
import { forwardRef} from 'react';
import { useTranslation } from 'libs/translation';

import styles from './EditButton.module.scss';

const EditButton = ({ className, ...props }, ref) => {
  const { t }  = useTranslation();

  return <IconButton title={t("actions.edit")} ref={ref} data-test-id="edit-button" className={classNames(styles['trash-button'], className)} Icon={EditField} {...props}/>
}

export default forwardRef(EditButton);
