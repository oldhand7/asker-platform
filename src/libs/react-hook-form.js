import { useEffect, useMemo } from "react";
import { useFormState, useForm as useFormOriginal } from "react-hook-form";
import { validate } from 'libs/validator';
import { dot2obj } from "./helper";

export const useForm = ({ values, rules, messages = {} }) => {
    const {
        handleSubmit: handleSubmitOriginal,
        setValue,
        reset,
        watch,
        control } = useFormOriginal({
        defaultValues: values
    })

    const watchAll = watch();

    const { isSubmitted } = useFormState({ control })

    const errors = useMemo(() => {
        if (isSubmitted) {
            const errors =  validate(watchAll, rules, messages);

            if (errors) {
                return dot2obj(errors)
            }
        }

        return null;
    }, [watchAll, isSubmitted, rules, messages])

    const handleInput = (field, dom = true) => {
        return val => setValue(field, dom ? val.target.value : val)
    }

    const handleSubmit = (cb, failureCb) => e => {
        handleSubmitOriginal(() => {
            const errors = validate(watchAll, rules, messages);

            if (!errors) {
                handleSubmitOriginal(cb)(e)
            } else {
                failureCb && failureCb(errors ? dot2obj(errors) : null)
            }

        })(e)
    }

    return {
        handleSubmit,
        values: watchAll,
        input: handleInput,
        reset,
        errors,
        isSubmitted,
        setValue
    }
}