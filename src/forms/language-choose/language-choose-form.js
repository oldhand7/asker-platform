import { LANGUAGES } from 'components/LanguageSwitcher/LanguageSwitcher';
import { useForm } from 'libs/react-hook-form';
import { useUser } from 'libs/user';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import classNames from 'classnames';
import ThemedButton from 'components/Button/ThemedButton';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const ReactSelect = dynamic(() => import('react-select'))

import styles from './language-choose-form.module.scss'
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

const StyledReactSelect = styled(ReactSelect)`
    .react-select__indicator-separator {
        display: none;
    }

    .react-select__control--menu-is-open .react-select__indicator {
        transform: rotate(180deg);
    }
`

const langSelectOptionTransform = u => ({
    value: u,
    label: u.name
})

const LanguageChooseForm = ({ className, values, onValues }) => {
    const { getUserLocale } = useUser();
    const { t } = useTranslation();
    const langOptions = useMemo(() => LANGUAGES.map(langSelectOptionTransform), [])

    const defaultValues = useMemo(() => {
        const locale = getUserLocale();
        const lang = LANGUAGES.find(lang => lang.id == locale)

        return {
            languageOption: langSelectOptionTransform(lang)
        }
    }, [])

    const {
        handleSubmit,
        control,
        setValue
    } = useForm({
        values: defaultValues
    })

    const languageOption = useWatch({
        control,
        name: 'languageOption',
        defaultValue: defaultValues.languageOption
    })

    const onSubmit = ({ languageOption }) => {
        onValues(languageOption ? languageOption.value : null)
    }

    const handleLanguageChange = useCallback(languageOption => {
        setValue('languageOption', languageOption)
    }, [setValue])

    return <form onSubmit={handleSubmit(onSubmit)} className={classNames(className, styles['form'])}>
        <h3 className={styles['form-title']}>{t('actions.choose-language')}</h3>

        <div data-test-id="language-choose">
        <StyledReactSelect
                instanceId='langselect1'
                classNamePrefix="react-select" 
                placeholder={t('actions.choose-language')}
                className={styles['form-select-input']}
                value={languageOption}
                onChange={handleLanguageChange}
                options={langOptions}
                autoFocus={true}
            /></div>

        <div className={styles['form-footer']}>
            <ThemedButton className={styles['form-footer-button']} type="submit" theme='green'>{t('actions.choose')}</ThemedButton>
            <ThemedButton className={styles['form-footer-button']} type="button" theme='red' onClick={() => onValues(0)}>{t('actions.cancel')}</ThemedButton>
        </div>
  </form>
}

export default LanguageChooseForm;