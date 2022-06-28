const { default: classNames } = require("classnames")
import CompareIcon from 'components/Icon/CompareIcon';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import PlatformButton from 'components/Button/PlatformButton';
import IconButton from 'components/IconButton/IconButton'
import IconCarretUp from 'components/Icon/CarretUpIcon';
import IconCarretDown from 'components/Icon/CarretDownIcon';

import styles from './CompareBox.module.scss';
import { useState } from 'react';

const CompareBox = ({ compare = [], className, interviews = [], project, onCompare, onCompareAll }) => {
    const [open, setOpen] = useState(false);

    const handleRedirectCompare = () => {
        window.location = `/projects/${project.id}/compare?interviews=${compare.map(c => c.id).join('|')}`
    }

    const selectAll = () => <CheckboxInputField checked={compare.length && compare.length == interviews.length} className={styles['compare-box-select-all']} label={'Select all'} onChange={onCompareAll} />

    return <div data-test-id="compare-box" className={classNames(
        styles['compare-box'],
        className,
        open ? styles['compare-box-open'] : ''
    )}>
        <div onClick={() => setOpen(!open)} className={styles['compare-box-header']}>
            <h3 className={styles['compare-box-header-title']}>
                <CompareIcon className={styles['compare-box-header-title-icon']} /> Compare (<span className={styles['compare-box-header-counter']}>{compare.length}/{interviews.length}</span>)
                <IconButton
                    className={styles['compare-box-header-toggle']}
                    Icon={open ? IconCarretUp : IconCarretDown} />
            </h3>
        </div>
        <div className={styles['compare-box-body']}>
            {selectAll()}
            <ul className={styles['compare-box-interviews']}>
                {interviews.map(i => (<li key={`${compare.length}-${i.id}`}>
                    <CheckboxInputField
                        checked={compare.indexOf(i) > -1}
                        onChange={() => onCompare(i)}
                        className={styles['compare-box-interviews-item']}
                        label={i.candidate.name} />
                </li>))}
            </ul>
            <PlatformButton className={styles['compare-box-button']}  onClick={handleRedirectCompare} disabled={compare.length == 0}>Show comparsion</PlatformButton>
        </div>
    </div>
}

export default CompareBox;