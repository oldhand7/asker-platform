import CheckboxInputField from "components/CheckboxInputField/CheckboxInputField";
import { useTranslation } from "libs/translation";
import { useState, useEffect, useMemo } from "react";

import styles from './LiveSelect.module.scss';

const LiveSelect = ({ selected = [], items = [], onChange }) => {
    const [selectedItems, setSelectedItems] = useState(selected);
    const { i18nField } = useTranslation();

    useEffect(() => {
        setSelectedItems(selected);
    }, [selected])

    const allSelected = useMemo(() => {
        return selectedItems.length && items.every(item => selectedItems.indexOf(item) > -1)
    }, [selectedItems, items])

    const toggleAll = () => {
        let selectedItems;

        if (allSelected) {
            selectedItems = []
        } else {
            selectedItems = [...items]
        }

        onChange(selectedItems)
    }

    const toggleSingle = (item) => {
        let selectedItemsCopy;

        if (selectedItems.indexOf(item) > -1) {
            selectedItemsCopy = selectedItems.filter(_item => _item != item)
        } else {
            selectedItemsCopy = [...selectedItems, item]
        }

        onChange(selectedItemsCopy)
    }

    return <div className={styles['live-select']}>
        <div className={styles['live-select-head']}>
            <CheckboxInputField className={styles['live-select-toggle-all']} checked={allSelected} label={'Select all'} onChange={toggleAll} />
        </div>
        <div className={styles['live-select-body']}>
            <ul className={styles['live-select-list']}>
                {items.map(item => (
                    <li className={styles['live-select-item']} key={item.id} onClick={() => toggleSingle(item)}>
                        <input className={styles['live-select-item-checkbox']} type="checkbox" checked={selectedItems.indexOf(item) > -1}  readOnly />
                        <span className={styles['live-select-item-name']}>{i18nField(item.name)}</span>
                        <span className={styles['live-select-item-desc']} dangerouslySetInnerHTML={{__html: i18nField(item.desc)}}></span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
}

export default LiveSelect;