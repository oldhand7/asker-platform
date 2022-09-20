

import TextInput from './TextInput';

import styles from './TextInputPreview.module.scss';

const TextInputPreview = () => {
    return <div className={styles['preview-input-wrapper']}>
        <TextInput className={styles['preview-input-red']} />
        <TextInput className={styles['preview-input-yellow']} />
        <TextInput className={styles['preview-input-green']} />
    </div>
}

export default TextInputPreview;