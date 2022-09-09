import { useForm } from "libs/react-hook-form";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import StageTemplateForm from './stage-template-form';

const createDocumentApi = type => ({
    filterManyDocuments: () => {
        return Promise.resolve([
            { id: 'aaa', name: 'A10', values: 10, type },
            { id: 'aaa', name: 'A20', values: 20, type },
            { id: 'aaa', name: 'A30', values: 30, type },
        ])
    },
    saveCollectionDocument: (c, doc) => {
        alert(`DOCUMENT: ${JSON.stringify(doc)}`)

        return Promise.resolve()
    },
    deleteSingle: () => {
        alert('document deleted!')

        return Promise.resolve()
    }
})

const defaultValues = {
    introduction: 0,
    summary: 0
}

const StageTemplateFormPreview = () => {
    const {
        setValue,
        control
    } = useForm({
        values: defaultValues
    })

    const formValues = useWatch({ control })

    const documentApis = useMemo(() => ({
        introduction: createDocumentApi('introduction'),
        summary: createDocumentApi('summary')
    }), [])

    return <div>
        <div>
            <h2>Introduction (count={formValues.introduction})</h2>
            <div>
                <button onClick={() => setValue('introduction', formValues.introduction + 1)}>+1</button>
            </div>
            <StageTemplateForm values={formValues.introduction} onValues={v => setValue('introduction', v)} documentsApi={documentApis.introduction} type='introduction' />
        </div>
        <div>
            <h2>Summary (count={formValues.summary})</h2>
            <div>
                <button onClick={() => setValue('summary', formValues.summary + 1)}>+1</button>
            </div>
            <StageTemplateForm values={formValues.summary} onValues={v => setValue('summary', v)} documentsApi={documentApis.summary} type='summary' />
        </div>
    </div>
}

export default StageTemplateFormPreview;