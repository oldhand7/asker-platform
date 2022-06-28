import Alert from 'components/Alert/Alert';
import PlatformButton from 'components/Button/PlatformButton';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import { useEffect, useState } from 'react';

import style from './candidate-choose-form.module.scss';

const CandidateChooseForm = ({ className, onValues, values = [], interviews = [] }) => {
    const [formValues, setValues] = useState(values || []);
    const [error, setError] = useState(null);

    const submit = () => {
        if (!formValues.length) {
            setError(new Error('Please choose at least one candidate.'))

            return;
        }

        onValues(formValues);
    }

    useEffect(() => {
        if (formValues.length) {
            setError(null);
        }
    }, [formValues])

    const toggleInterview = (interview) => {
        if (formValues.indexOf(interview) > -1) {
            setValues([...formValues.filter(i => i != interview)])
        } else {
            setValues([...formValues, interview])
        }
    }

    return <div className={style['candidate-choose-form']}>
        {error ? <Alert className={style['candidate-choose-form-alert']} /> : null}

        <ul className={style['candidate-choose-form-list']}>
        {interviews.map(i => (
            <li className={style['candidate-choose-form-list-item']} key={i.id}>
                <CheckboxInputField label={i.candidate.name} className={style['candidate-choose-form-list-item-input-field']} checked={formValues.indexOf(i) > -1} onChange={() => toggleInterview(i)} />
            </li>
        ))}
        </ul>
        <PlatformButton className={style['candidate-choose-form-submit']} disabled={!formValues.length} onClick={submit}>Choose candidates</PlatformButton>
    </div>
}

export default CandidateChooseForm;