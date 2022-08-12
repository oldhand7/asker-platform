const { default: classNames } = require("classnames")
import CompareIcon from 'components/Icon/CompareIcon';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PillLabel from 'components/PillLabel/PillLabel';
import colorBetween from 'color-between';
import { useEffect, useState } from 'react';
import UpDownButton from 'components/UpDownButton/UpDownButton';

import styles from './CompareBox.module.scss';

const getColor = (score) => {
    if (score < 25) {
      return '#E77272';
    }

    if (score < 50) {
      return '#DFD049';
    }

    return colorBetween('#9AE23E', '#43B88C', score / 100, 'hex');
  }

const CompareBox = ({ compare = [], className, interviews = [], project, onCompare, onCompareAll }) => {
    const [open, setOpen] = useState(false);
    const [prevCompare, setPrevCompare] = useState([]);

    const handleRedirectCompare = () => {
        window.location = `/projects/${project.id}/compare?interviews=${compare.map(c => c.id).join('|')}`
    }

    const selectAll = () => <CheckboxInputField checked={compare.length && compare.length == interviews.length} className={styles['compare-box-select-all']} label={'Select all'} onChange={onCompareAll} />

    useEffect(() => {
        if (prevCompare.length == 0 && compare.length == 1) {
            setOpen(true);
        }

        if (prevCompare.length != compare.length) {
            setPrevCompare([...compare])
        }
    }, [prevCompare, compare.length])

    return <div data-test-id="compare-box" className={classNames(
        styles['compare-box'],
        className,
        open ? styles['compare-box-open'] : ''
    )}>
        <div onClick={() => setOpen(!open)} className={styles['compare-box-header']}>
            <h3 className={styles['compare-box-header-title']}>
                <CompareIcon className={styles['compare-box-header-title-icon']} /> Compare (<span className={styles['compare-box-header-counter']}>{compare.length}/{interviews.length}</span>)
                <UpDownButton className={styles['compare-box-header-toggle']} on={!open} />
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
                        label={<div className={styles['compare-box-interviews-item-label']}>
                            <span className={styles['compare-box-interviews-item-label-name']}>{project.anonimize ? i.candidate.alias : i.candidate.name}</span>
                            <PillLabel color={getColor(i.score || 0)} className={styles['compare-box-interviews-item-label-score']}>
                                {i.score || 0}%
                            </PillLabel>
                        </div>} />
                </li>))}
            </ul>
            <PlatformButton className={styles['compare-box-button']}  onClick={handleRedirectCompare} disabled={compare.length == 0}>Show comparsion</PlatformButton>
        </div>
    </div>
}

export default CompareBox;
