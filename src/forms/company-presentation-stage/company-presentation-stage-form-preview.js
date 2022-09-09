import { DbContext } from 'libs/db';
import { UserContext } from 'libs/user';
import { useState } from 'react';
import CompanyPresentationStageForm from './company-presentation-stage-form';

import styles from './company-presentation-stage-form-preview.module.scss';

const CompanyPresentationStageFormPreview = () => {
    const [values, setValues] = useState(null);

    const documentsApi = {
        uploadCompanyFile: (...vars) => Promise.resolve('https://placekitten.com/200/300')
    }

    const userApi = {
        user: { id: 'u1', name: 'User 1', companyId: 'u1c1' }
    }

    return <div>
        <pre>{JSON.stringify(values)}</pre>

        <DbContext.Provider value={documentsApi}>
        <UserContext.Provider value={userApi}>
            <CompanyPresentationStageForm className={styles['company-presentation-stage-form']} values={values} onValues={setValues}/>
        </UserContext.Provider>
    </DbContext.Provider>
    </div>
}

export default CompanyPresentationStageFormPreview;