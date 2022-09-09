import { useCallback, useEffect, useState } from "react";
import classNames from 'classnames';
import styled from 'styled-components';
import { useTranslation } from "libs/translation";
import { useUser } from "libs/user";
import { useDocumentsApi } from "libs/db";
import dynamic from "next/dynamic";

import styles from './InterviewerSelect.module.scss';

const ReactSelect = dynamic(() => import('react-select'))


const StyledReactSelect = styled(ReactSelect)`
    .react-select__indicator-separator {
        display: none;
    }

    .react-select__control--menu-is-open .react-select__indicator {
        transform: rotate(180deg);
    }
`

const userSelectOptionTransform = u => ({
    value: u,
    label: u.name
})

const InterviewerSelect = ({ className, interviewer, interviewers, error, onChange, ...props }) => {
    const [selectOptions, setSelectOptions] = useState([])
    const [_interviewer, setInterviewer] = useState(null);
    const { t } = useTranslation();
    const { user } = useUser();
    const docsApi = useDocumentsApi();
    
    useEffect(() => {
        if (interviewers) {
            return;
        }

        const dbFilter = [];

        if (user) {
            dbFilter.push(['companyId', '==', user.companyId])
        }

        const dbSort = [
            ['name', 'asc']
        ];

        docsApi.filterMany('users', dbFilter, dbSort)
            .then(users => users.map(userSelectOptionTransform))
            .then(setSelectOptions)
    }, [user, docsApi, interviewers])

    useEffect(() => {
        if (interviewers) {
            setSelectOptions(interviewers.map(userSelectOptionTransform))
        }
    }, [interviewers])

    useEffect(() => {
        if (interviewer && selectOptions.length) {
            const match = selectOptions.find(so => so.value.id == interviewer.id);

            setInterviewer(match)
        }
    }, [selectOptions, interviewer])

    const handleInterviewerSelect = useCallback((option) => {
        setInterviewer(option);
        onChange && onChange(option && option.value)
    }, [onChange])

    return <div data-test-id="interviewer-select" className={classNames(
        styles['interviewer-select'],
        className,
        error ? styles['interviewer-select-error'] : error
    )}><StyledReactSelect
            instanceId='intselect1'
            classNamePrefix="react-select" 
            placeholder={t('actions.select-interviewer')}
            className={styles['interviewer-select-input']}
            value={_interviewer}
            onChange={handleInterviewerSelect}
            options={selectOptions}
            {...props} 
        />
        {error && <p className={'form-error'}>{error}</p>}
    </div>
}

export default InterviewerSelect;