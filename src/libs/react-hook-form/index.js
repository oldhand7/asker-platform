import { useCallback, useEffect, useState } from "react";
import { useForm as _useForm } from "react-hook-form";
import { useValidate } from 'libs/validator';

export const useForm = ({
    values: _defaultValues,
    defaultValues,
    rules = {},
    messages = {},
    id = '',
    ...props
}) => {

    const initValue = defaultValues || _defaultValues;

    const api = _useForm({
        defaultValues: initValue,
        ...props
    })

    const [values, setValues] = useState(initValue);

    useEffect(() => {
        api.watch(setValues)
    }, [api.watch]);

    const input = useCallback((field, dom = true) => {
        return val => {
            api.setValue(field, dom ? val.target.value : val)
        }
    }, [api.setValue])

    const { errors } = useValidate({ values, rules, messages })

    useEffect(() => {
        if (errors) {
            api.setError('_error', { type: 'custom', message: 'error' })
        } else {
            api.clearErrors('_error');
        }
    }, [errors, api.clearErrors, api.setError])

    return {
        ...api,
        values,
        errors,
        input
    }
}

