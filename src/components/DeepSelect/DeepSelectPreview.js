import { useState } from 'react';
import DeepSelect from './DeepSelect';

import styles from './DeepSelectPreview.module.scss';

const options1 = [
    { name: 'AAA', value: '111' },
    { name: 'BBB', value: '222' },
    { name: 'CCC', value: '333' }
]

const options2 = [
    { name: 'XXX', value: '111' },
    { name: 'YYY', value: '222' },
    { name: 'ZZZ', value: '333' }
]

const handleAction = (a, o) => {
    alert('ACTION ' + a.id + ' FOR ' + o.name)
}

const actions = [
    { name: 'Kill it', id: 'kill-it'}
]

const DeepSelectPreview = () => {
    const [option1, setOption1] = useState(null)
    const [option2, setOption2] = useState(options2[0])

    return <div>
        <div className={styles['deep-select-wrapper']}>
            <h2>#1 No props</h2>
            <DeepSelect  />
        </div>

        <div className={styles['deep-select-wrapper']}>
            <h2>#2 No initial option <strong>{option1 && option1.name}</strong></h2>
            <div>
                <button onClick={() => setOption1(options1[options1.length - 1])}>Choose last option</button>
            </div>
            <DeepSelect
                option={option1}
                options={options1}
                onChange={setOption1}
                placeholder='Chooz Option'
                emptyWarning='Empty here.'
                className={styles['deep-select']}
                actions={actions}
                onAction={handleAction}
            />
        </div>

        <div className={styles['deep-select-wrapper']}>
            <h2>#2 With initial option <strong>{option2 && option2.name}</strong></h2>
            <div>
                <button onClick={() => setOption2(options2[options2.length - 1])}>Choose last option</button>
            </div>
            <DeepSelect
                option={option2}
                options={options2}
                onChange={setOption2}
                placeholder='Chooz Option'
                emptyWarning='Empty here.'
                className={styles['deep-select']}
                actions={actions}
                onAction={handleAction}
            />
        </div>

    </div>
}

export default DeepSelectPreview;