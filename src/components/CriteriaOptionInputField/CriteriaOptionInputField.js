import PlusIcon from 'components/Icon/PlusIcon';
import OutlineButton from 'components/Button/OutlineButton';
import { useModal } from 'libs/modal';
import CriteriaOptionModal from 'modals/criteria-option/criteria-option-modal';
import Autocomplete from 'components/Autocomplete/Autocomplete';
import { useUser } from 'libs/user';
import { getManyFromCollection } from 'libs/firestore'
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './CriteriaOptionInputField.module.scss';

const CriteriaOptionInputField = ({ error, className, value, onChange, criteria }) => {
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const openCriteriaOptionModal = useModal(CriteriaOptionModal, { criteria })
  const { user } = useUser();

  useEffect(() => {
    const filter = [
      ['companyId', '==', user.companyId],
      ['type', '==', criteria.id]
    ]

    getManyFromCollection('criteriaOptions', filter).then(setCriteriaOptions)
  }, [criteria, user])

  const handleCriteriaOption = option => {
    if (!option) {
      return;
    }

    onChange({
      id: option.id,
      name: option.name,
      type: criteria.id
    })
  }

  const resetOption = () => {
    onChange(null)
  }

  return <div className={classNames(styles['criteria-option-input-field'], className)}>
    <span className={styles['criteria-option-input-field-label']}>{criteria.name}:</span>

    {
      !value ?
      <>
        <Autocomplete className={styles['criteria-option-input-field-autocomplete']} options={criteriaOptions} onSearch={handleCriteriaOption} />
        <OutlineButton type="button" onClick={() => openCriteriaOptionModal(handleCriteriaOption)} className={styles['criteria-option-input-field-button']} >
          <PlusIcon /> Create new
        </OutlineButton>
      </> :
      <div className={styles['criteria-option-input-field-card']}>
        <span className={styles['criteria-option-input-field-card-label']}>
          {value.name}
        </span>
        <TrashButton onClick={resetOption} className={styles['criteria-option-input-field-card-button']} />
      </div>
    }

    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default CriteriaOptionInputField;
