import PlusIcon from 'components/Icon/PlusIcon';
import OutlineButton from 'components/Button/OutlineButton';
import { useModal } from 'libs/modal';
import CriteriaOptionModal from 'modals/criteria-option/criteria-option-modal';
import Autocomplete from 'components/Autocomplete/Autocomplete';
import { useUser } from 'libs/user';
import { filterManyDocuments } from 'libs/firestore'
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import TrashButton from 'components/TrashButton/TrashButton';
import Separator from 'components/Separator/Separator'
import FlexRow from 'components/FlexRow/FlexRow';
import EditButton from 'components/EditButton/EditButton';
import striptags from 'striptags';
import { EVALUATION_CRITERIA_TYPES } from 'libs/criteria'

import styles from './CriteriaOptionInputField.module.scss';

const CriteriaOptionInputField = ({ error, className, value, onChange, type }) => {
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const openCriteriaOptionModal = useModal(CriteriaOptionModal)
  const { user } = useUser();

  useEffect(() => {
    const filter = [
      ['companyId', 'in', [user.companyId, 'asker']],
      ['type', '==', type]
    ]

    const sort = [
      ['name', 'asc']
    ]

    filterManyDocuments('criteriaOptions', filter, sort).then(setCriteriaOptions)
  }, [type, user, value])

  const handleCriteriaOption = option => {
    if (!option) {
      return;
    }

    onChange(option)
  }

  const resetOption = () => {
    onChange(null)
  }
  
  const  handleOpenModal = () => {
    openCriteriaOptionModal(onChange, { type, values: value });
  }

  return <div data-test-id="criteria-option-input-field" className={classNames(styles['criteria-option-input-field'], className)}>
    <span className={styles['criteria-option-input-field-label']}>{EVALUATION_CRITERIA_TYPES[type].name}:</span>

    {
      !value ?
      <>
        <Autocomplete className={styles['criteria-option-input-field-autocomplete']} options={criteriaOptions} onSearch={handleCriteriaOption} />
        <FlexRow>
          <Separator background='' />
          <OutlineButton type="button" onClick={handleOpenModal} className={styles['criteria-option-input-field-button']} >
            <PlusIcon /> Create new {EVALUATION_CRITERIA_TYPES[type].name.toLowerCase()}
          </OutlineButton>
        </FlexRow>
      </> :
      <div className={styles['criteria-option-input-field-card']}>
        <div className={styles['criteria-option-input-field-card-label']}>
          <span className={styles['criteria-option-input-field-card-label-name']}>{value.name}</span>
          {
            value.desc ?
            <div
              className={styles['criteria-option-input-field-card-label-desc']}
              dangerouslySetInnerHTML={{ __html: striptags(value.desc) }}></div> :
            null
          }
        </div>
        {
          user && value.companyId == user.companyId ?
          <EditButton onClick={() => openCriteriaOptionModal(onChange)} className={styles['criteria-option-input-field-card-button']} /> :
          null
        }
        <TrashButton onClick={resetOption} className={styles['criteria-option-input-field-card-button']} />
      </div>
    }

    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default CriteriaOptionInputField;
