import { useState, useEffect } from 'react';
import { validate } from 'libs/validator';

const useForm = (options = {}) => {
  const [values, setValues] = useState(typeof options.values !== 'undefined' ? options.values : {});
  const [pristine, setPristine] = useState(typeof options.pristine !== 'undefined' ? options.pristine : true)
  const [errors, setErrors] = useState(null);

  const handleInput = (field, dom = true) => {
    return val => setValues({
      ...values,
      [field]: dom ? val.target.value : val
    })
  }

  useEffect(() => {
    if (!pristine) {
      const errors = validate(values, options.rules, options.messages);

      setErrors(errors)
    }
  }, [pristine, values])

  const handleSubmit = (cb, onError, ev) => {
    return (ev) => {
     ev.preventDefault();

     const errors = validate(values, options.rules, options.messages);

     if (!errors) {
       cb(values, ev)
     } else {
       setErrors(errors)
       onError(errors, ev)
     }
   }
  }

  useEffect(() => {
    if (errors) {
      setPristine(false);
    }
  }, [errors])

  const handleToggle = (field) => {
    return () => {
      setValues({
        ...values,
        [field]: !values[field]
      })
    }
  }

  const handleSet = (field, value) => {
    setValues({
      ...values,
      [field]: value
    })
  }

  return [
    values,
    errors,
    {
      input: handleInput,
      submit: handleSubmit,
      toggle: handleToggle,
      set: handleSet,
      setValues
    }
  ]
}

export default useForm;
