import { useState, useEffect, useRef } from 'react';
import { validate } from 'libs/validator';

export const useForm = (options = {}) => {
  const valuesAbs = useRef(typeof options.values !== 'undefined' ? JSON.parse(JSON.stringify(options.values)) : {});
  const [values, setValues1] = useState(valuesAbs.current)
  const [pristine, setPristine] = useState(typeof options.pristine !== 'undefined' ? options.pristine : true)
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(typeof options.submitted !== 'undefined' ? options.submitted : false)
  const [liveValidation, setLiveValidation] = useState(typeof options.liveValidation !== 'undefined' ? options.liveValidation : false)

  const setValues = values => {
    valuesAbs.current = { ...values };
    setValues1(values)
  }

  const handleInput = (field, dom = true) => {
    return val => {
      setValues({
        ...valuesAbs.current,
        [field]: dom ? val.target.value : val
      })
      setPristine(false);
    }
  }

  useEffect(() => {
    if (submitted || liveValidation) {
      const errors = validate(valuesAbs.current, options.rules, options.messages);

      setErrors(errors)
    }
  }, [liveValidation, submitted, values])

  const handleSubmit = (cb, onError, ev) => {
    return (ev) => {
     ev.preventDefault();

     const errors = validate(valuesAbs.current, options.rules, options.messages);

     if (!errors) {
       cb(JSON.parse(JSON.stringify(valuesAbs.current)), ev)
     } else {
       setErrors(errors)

      if (onError) {
        onError(errors, ev)
      }
     }

     setSubmitted(true)
   }
 }

  useEffect(() => {
    if (errors) {
      setPristine(false);
    }
  }, [errors])

  const toggle = (field) => {
    return () => {
      setValues({
        ...valuesAbs.current,
        [field]: !valuesAbs.current[field]
      })
    }
  }

  const handleValue = (field, value) => {
    setValues({
      ...valuesAbs.current,
      [field]: value
    })
  }

  const reset = () => {
    setPristine(true);
    setValues(typeof options.values !== 'undefined' ? JSON.parse(JSON.stringify(options.values)) : {})
  }

  return {
    values: values,
    errors,
    pristine,
    submitted,
    control: {
      input: handleInput,
      submit: handleSubmit,
      toggle,
      set: handleValue,
      setValues,
      reset
    }
  }
}
