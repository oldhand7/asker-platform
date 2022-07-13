import Alert from 'components/Alert/Alert';
import PlatformButton from 'components/Button/PlatformButton';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import { useEffect, useState } from 'react';
import colorBetween from 'color-between';
import PillLabel from 'components/PillLabel/PillLabel';
import { scoreSort } from 'libs/helper';

import styles from './candidate-choose-form.module.scss';

const getColor = (score) => {
    if (score < 25) {
      return '#E77272';
    }
  
    if (score < 50) {
      return '#DFD049';
    }
  
    return colorBetween('#9AE23E', '#43B88C', score / 100, 'hex');
  }

const CandidateChooseForm = ({ className, onValues, values = [], interviews = [] }) => {
    const [formValues, setValues] = useState(values || []);
    const [error, setError] = useState(null);

    const [_interviews, setInterviews] = useState([]);

    useEffect(() => {
        const _interviews = [...interviews];

        _interviews.sort(scoreSort)

        setInterviews(_interviews)
    }, [interviews])

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

    return <div className={styles['candidate-choose-form']}>
        <h5 className={styles['candidate-choose-form-title']}>Choose candidate</h5>

        {error ? <Alert className={styles['candidate-choose-form-alert']}>{error.message}</Alert> : null}

        <ul className={styles['candidate-choose-form-list']}>
        {_interviews.map(i => (
            <li className={styles['candidate-choose-form-list-item']} key={i.id}>
                <CheckboxInputField label={<div className={styles['candidate-choose-form-list-item-label']}>
                    <span className={styles['candidate-choose-form-list-item-label-name']}>{i.candidate.name}</span>

                    <PillLabel color={getColor(i.score || 0)} className={styles['candidate-choose-form-list-item-label-score']}>
                                {i.score || 0}%
                            </PillLabel>
                </div>} className={styles['candidate-choose-form-list-item-input-field']} checked={formValues.indexOf(i) > -1} onChange={() => toggleInterview(i)} />
            </li>
        ))}
        </ul>
        <PlatformButton className={styles['candidate-choose-form-submit']} onClick={submit}>Choose candidates</PlatformButton>
    </div>
}

export default CandidateChooseForm;