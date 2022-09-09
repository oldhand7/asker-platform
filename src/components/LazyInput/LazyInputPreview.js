import { useState } from "react";
import LazyInput from './LazyInput';
import { validate } from "libs/validator";

import ChatIcon from "components/Icon/ChatIcon";

import styles from './LazyInputPreview.module.scss';

const LazyInputPreview = () => {
  const [value, setValue] = useState(2008);

  const validateProp = (value) => {
    const rules = {
      value: 'required'
    }

    const errors = validate({ value }, rules);

    return errors && errors.value;
  }

  return <div>
    <p><strong>Result</strong>: {value}</p>
    <LazyInput beforeIcon={ChatIcon} validate={validateProp} className={styles['lazy-input']} label={`Year ${value}`} onChange={setValue} value={value} placeholder="2005" />
  </div>
}

export default LazyInputPreview;