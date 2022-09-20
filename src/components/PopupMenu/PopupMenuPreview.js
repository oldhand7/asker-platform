import { useState } from "react"
const { default: PopupMenu } = require("./PopupMenu")

import styles from './PopupMenuPreview.module.scss';

const menuItems = [
    { id: 'aaa', name: 'AAA' },
    { id: 'bbb', name: 'BBB' },
    { id: 'ccc', name: 'CCC' }
]

const handleMenuChoice = (option) => {
    alert('CHOICE: ' + option.id)
}

const PopupMenuPreview = () => {
    const [open, setOpen] = useState(false);

    return <div>
        <div className={styles['popup-menu-preview']}>
            <h2>#1 No props</h2>
            <PopupMenu />
        </div>
        <div className={styles['popup-menu-preview']}>
            <h2>#2 Custom configuration</h2>
            <div>
                <button onClick={() => setOpen(typeof open === "boolean" ? 1 : true)}>Open menu</button>
            </div>
            <PopupMenu items={menuItems} className={styles['popup-menu']} onChange={handleMenuChoice} open={open}>Open</PopupMenu>
        </div>
    </div>
}

export default PopupMenuPreview;