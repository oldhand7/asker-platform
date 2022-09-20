import { useTranslation } from "libs/translation";
const { useState, useCallback, useMemo, memo } = require("react")
import ThemedButton from 'components/Button/ThemedButton'
import TextInputField from "components/TextInputField/TextInputField";
import { useForm } from "libs/react-hook-form";
import { useWatch } from "react-hook-form";
import Alert from 'components/Alert/Alert';

import styles from './ProjectSaveAsTemplatePopup.module.scss';
import classNames from "classnames";

const ProjectSaveAsTemplatePopup = ({ className, onSave }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('choice');
    const [error, setError] = useState(null);

    const initValues = useMemo(() => ({ templateName: '' }), [])

    const {
        control,
        setValue
    } = useForm({
        values: initValues 
    })

    const formValues = useWatch({ control, defaultValue: initValues })

    const templateNameHandler = useCallback((ev) => {
        setValue('templateName', ev.target.value)
    }, [setValue])

    const handleSubmit = () => {
        if (formValues.templateName) {
            onSave(
                formValues.templateName,
                () => {
                    setMode('template-success')

                    return new Promise((resolve, reject) => {
                        setTimeout(resolve, 1500)
                    })
                }
            )
        } else {
            setError(t('errors.field.required'))
        }
    }

    return <div className={classNames(
        styles['popup'],
        className
    )} onClick={ev => ev.stopPropagation()}>
        <div className={styles['popup-head']}>{t('actions.confirm-save-as-template')}</div>

        {
            mode == 'choice' ?
            <>
                <div className={styles['popup-footer']}>
                    <ThemedButton className={styles['popup-footer-button']} type="button" theme='red' onClick={() => onSave(null)}>{t('labels.no')}</ThemedButton>

                    <ThemedButton className={styles['popup-footer-button']} type="button" theme='green' onClick={(ev) => {
                        ev.stopPropagation();

                         setMode('template');


                    }}>{t('labels.yes')}</ThemedButton>
                </div>
            </> : null
        }

        {
            mode == 'template' ?
            <>
                <TextInputField maxlength={100} error={error} className={styles['popup-input-template-name']} value={formValues.templateName} onChange={templateNameHandler} placeholder={t('placeholders.template-name')}  />

                <div className={styles['popup-footer']}>
                    <ThemedButton className={classNames(
                        styles['popup-footer-button'],
                        styles['popup-footer-button-fw']
                    )} type="button" theme='green' onClick={handleSubmit}>{t('actions.save-as-template')}</ThemedButton>
                </div>
            </> : null
        }

        {
            mode == 'template-success' ?
            <Alert type="success">{t('status.template-saved')}</Alert> :
            null
        }
    </div>
}

export default memo(ProjectSaveAsTemplatePopup);