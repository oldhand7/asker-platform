const { useForm } = require("libs/react-hook-form");
const { useUser } = require("libs/user");
const { useState, useEffect, useCallback, useMemo } = require("react");
import TinyInputForm from 'forms/tiny-input/tiny-input-form';
import classNames from 'classnames';
import DeepSelect from 'components/DeepSelect/DeepSelect';
import { filterManyDocuments, saveCollectionDocument, deleteSingle } from 'libs/firestore'
import Preloader from 'components/Preloader/Preloader';
import TrashIcon from 'components/Icon/TrashIcon';
import { useTranslation } from 'libs/translation'
import { memo } from 'react';
import { useWatch } from 'react-hook-form';

import styles from './stage-template-form.module.scss';

const defaultFirestoreApi = {
    filterManyDocuments,
    saveCollectionDocument,
    deleteSingle
}

const config2option = config => ({
    name: config.name,
    value: config
})

const StageTemplateForm = ({ className, type = '', values = null, onValues, documentsApi = defaultFirestoreApi }) => {
    const { user } = useUser();
    const { t } = useTranslation();
    const [templateOption, setTemplateOption] = useState(null)
    const [mode, setMode] = useState(null);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const initValues = useMemo(() => ({
        name: '',
        type,
        values
    }), [])

    const {
        setValue,
        reset,
        control
    } = useForm({
        values: initValues
    })

    const formValues = useWatch({ control, defaultValue: initValues })

    useEffect(() => {
        if (templateOption) {
            reset(templateOption.value)
        }
    }, [templateOption])

    useEffect(() => {
        setValue('values', values)
    }, [values, setValue])
    
    const updateTemplateList = () => {
        const dbQuery = [
          ['type', '==', type]
        ];

        if (user) {
            dbQuery.push(['companyId', '==', user.companyId])
        }
        
        const dbSort = [
          ['name', 'ASC']
        ]
    
        return documentsApi.filterManyDocuments('configTemplates', dbQuery, dbSort)
          .then(configs => configs.map(config2option))
          .then(setTemplateOptions)
    }

    useEffect(() => {
        updateTemplateList();
      }, [type])
    
    useEffect(() => {
        if (onValues && templateOption) {
            onValues(templateOption.value.values)
        }
    }, [templateOption])

    const handleTemplateSave = useCallback(async ({ value: name }) => {
        setLoading(true);

        const configTemplate = {
            ...formValues,
            name
        }

        if (user) {
            configTemplate.companyId = user.companyId;
        }

        try {
            const id = await documentsApi.saveCollectionDocument(
                'configTemplates',
                configTemplate
            );

            configTemplate.id = id;

            setValue('id', id);

            const configTemplateOption = config2option(configTemplate);

            setTemplateOptions([
                ...templateOptions.filter(to => to.value.id != configTemplate.id),
                configTemplateOption
            ])

            setTemplateOption(configTemplateOption)

            setLoading(false);
        } catch (error) {
            setError(error)
        }
}, [formValues, user, templateOption, templateOptions])

    useEffect(() => {
        setLoading(false);
    }, [error])

    const handleAction = async (action, option) => {
        if (option && action && action.id == 'delete') {
            setLoading(true);

            try {
                await documentsApi.deleteSingle('configTemplates', option.value.id);
                await updateTemplateList();

                if (templateOption == option) {
                    setTemplateOption(null)
                }

                setLoading(false);
            } catch (error) {
                setError(error)
                setLoading(false);
            }            
        }
    }

    return <div className={classNames(styles['stage-template-form'], className)}>
        <div className={styles['stage-template-form-select']}>
            <span className={styles['stage-template-form-select-label']}>{t('labels.template.plural')}</span>
            <DeepSelect onAction={handleAction} actions={[
                { id: 'delete', icon: TrashIcon, name: t('actions.delete') }
            ]} onChange={setTemplateOption} option={templateOption} options={templateOptions} setTemplateOption={setTemplateOption} className={styles['stage-template-form-select-input']} />
        </div>
        
        <div className={styles['stage-template-form-control']}>
            {
                templateOption || mode == 'new' ?
                <TinyInputForm name="template_name" required={true} requiredMessage={t('errors.field.required')} className={styles['stage-template-form-input']} placeholder={t('labels.name')} buttonLabel={t('actions.save')} values={{ value: formValues.name || '' }} onValues={handleTemplateSave} /> :
                <button className={styles['stage-template-form-control-save']} type="button" onClick={() => setMode('new')}>{t('actions.save.as-template')}</button>
            }
            {error ? <p className="form-error">{error.message}</p> : null}
        </div>
        {loading ? <Preloader /> : null}
    </div>
}

export default memo(StageTemplateForm);