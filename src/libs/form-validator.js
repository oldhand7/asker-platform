import { useMemo } from "react";

export const useValidate = ({ values, rules, messages, pristine = true }) => {
    const errors = useMemo(() => {
        if (pristine) return;

        const errors = validate(values, rules, messages);

        if (errors) {
            return dot2obj(errors)
        }
    }, [values, rules, messages, pristine])

    return {
        errors
    };
}