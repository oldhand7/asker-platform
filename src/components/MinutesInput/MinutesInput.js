import classNames from 'classnames';
import LazyInput from 'components/LazyInput/LazyInput';
import ClockIcon from 'components/Icon/ClockIcon';
import { useTranslation } from 'libs/translation';
import { useCallback, useMemo } from 'react';
import { validate } from 'libs/validator';

import styles from './MinutesInput.module.scss';

const MinutesInput = ({ minutes, value = 5, onChange, required = true, className }) => {
  const { t }  = useTranslation();

  const minutesResolved = useMemo(() => minutes || value, [minutes, value]);

  const validateValue = useCallback((value) => {
    const errors = validate({ value }, { value: 'required|numeric' })

    return errors && errors.value;
  }, [required])

  return <LazyInput
    data-test-id="minutes-input"
    beforeIcon={ClockIcon}
    validate={validateValue}
    className={classNames(
      styles['minutes-input'], className)}
    value={minutesResolved}
    label={`${minutesResolved}m`}
    onChange={onChange}
    placeholder={t('labels.minutes.short')}
    maxLength={3}
    showError={false}
    />
}

export default MinutesInput;
