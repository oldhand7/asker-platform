import classNames from "classnames";
import HtmlInputField from "components/HtmlInputField/HtmlInputField";
import { LANGUAGES } from "components/LanguageSwitcher/LanguageSwitcher"
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const createDefaultValues = () => {
    return LANGUAGES.reduce((values, lang) => {
        values[lang.id] = '';

        return values;
    }, {})
}

import styles from './I18nHtmlInputField.module.scss';

const I18nHtmlInputField = ({ diff = 0, values, onChange, errors, ...props }) => {
    const router = useRouter();
    const [locale, setLocale] = useState(router.locale)

    const handleChange = useCallback((value) => {
        onChange(value, locale)
    }, [onChange, locale])

    return <div className={styles['input-field']}>
        <ul className={styles['input-field-langs']}>
            {LANGUAGES.map(lang => (
                <li className={classNames(
                    styles['input-field-langs-item'],
                    locale == lang.id && styles['input-field-langs-item-active']
                )} onClick={() => setLocale(lang.id)} key={lang.id}>{lang.emoji} {lang.name}</li>
            ))}
        </ul>
        <HtmlInputField diff={`${locale}-${diff}`} error={errors && errors[locale]} value={values && values[locale]} onChange={handleChange} className={styles['input-field-input']} {...props} />
    </div>
}

export default I18nHtmlInputField;