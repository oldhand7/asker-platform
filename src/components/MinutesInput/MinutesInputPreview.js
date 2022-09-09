import { useState } from "react"
import MinutesInput from "./MinutesInput"

import styles from './MinutesInputPreview.module.scss'

const MinutesInputPreview = () => {
    const [minutes, setMinutes] = useState(40);

    return <MinutesInput className={styles['minutes-input']} minutes={minutes} onChange={setMinutes} />
}

export default MinutesInputPreview;