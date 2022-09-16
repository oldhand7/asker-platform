import classNames from "classnames";
import { useForm } from 'libs/react-hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextInput from "components/TextInput/TextInput"
import {  useWatch } from "react-hook-form";

import styles from './tiny-input-form.module.scss';

const TinyInputForm = ({
    values,
    required = true,
    requiredMessage = 'Field is required',
    onValues,
    name='name',
    placeholder = 'Type here',
    buttonLabel = 'Save',
    extraButtonLabel = 'Save as new',
    extraButton = false,
    className,
    maxLength = 25,
    onExtraSubmit
}) => {
    const initValues = useMemo(() => values, [])

    const validationRules = useMemo(() => ({
        value: required ? 'required' : '',
    }), [required])

    const validationMessages = useMemo(() => ({
        'required.value': requiredMessage
    }), [requiredMessage])

    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        errors,
        setValue,
        control
    } = useForm({
        values: initValues,
        rules: validationRules,
        messages: validationMessages,
    });

    useEffect(() => {
        setIsSubmitted(false)
    }, [values])

    const formValues = useWatch({ control, defaultValue: initValues })

    const ref = useRef();

    const onSubmit = useCallback(() => {
        onValues && onValues(formValues)
    }, [formValues, onValues])

    useEffect(() => {
        values && setValue('value', values.value)
    }, [values])

    const handleSubmit = useCallback(() => {
        setIsSubmitted(true);

        if (!errors) {
            onSubmit(formValues)
        }
    }, [formValues, errors, onSubmit])

    const handleExtraSubmit = useCallback(() => {
        setIsSubmitted(true);

        if (!errors) {
            onExtraSubmit(formValues)
        }
    }, [formValues, errors, onExtraSubmit])

    const handleValue = useCallback((ev) => {
        setValue('value', ev.target.value)
    }, [setValue])

    return <div ref={ref} className={classNames(
        styles['tiny-input-form'],
        className,
    )}>
        <div className={styles['tiny-input-form-input-field']}>
            <div className={styles['tiny-input-form-input-field-body']}>
                <TextInput maxLength={maxLength} className={styles['tiny-input-form-input']} onEnter={handleSubmit} placeholder={placeholder} type="text" name={name} autoComplete="false" value={formValues.value} onChange={handleValue} />
                <button className={classNames(
                    styles['tiny-input-form-button'],
                    extraButton ? styles['tiny-input-form-button-has-extra'] : ''
                )} type="button" onClick={handleSubmit}>{buttonLabel}</button>
                {extraButton ? <button className={classNames(
                    styles['tiny-input-form-button'],
                    styles['tiny-input-form-button-extra']
                )} type="button" onClick={handleExtraSubmit}>{extraButtonLabel}</button> : null}
            </div>
            {isSubmitted && errors && errors.value && <p className="form-error">{errors.value}</p>}
        </div>

    </div>
}

export default TinyInputForm;