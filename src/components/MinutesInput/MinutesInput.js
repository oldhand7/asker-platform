import classNames from 'classnames';
import { useState, useEffect } from 'react';
import EditInput from 'components/EditInput/EditInput';

import styles from './MinutesInput.module.scss';

const MinutesInput = ({ value = 5, onChange, className }) => (
  <EditInput
    className={classNames(
      styles['minutes-input'], className)}
    value={value}
    label={`${value} min.`}
    onChange={onChange}
    placeholder='Min.'
    />
)

export default MinutesInput;
