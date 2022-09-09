import { getProjectEvaluationCriterias } from "libs/project"
import { useMemo, useState } from "react"
import ScoringRulesForm from "./scoring-rules-form"

const ScoringRulesFormPreview = () => {
    const [values, setValues] = useState(null);

    const project = {
        config: {
            's': {
                questions: [
                    { type: 'screening' }
                ]
            },
            'o': {
                questions: [
                    { type: 'other' }
                ]
            },
            'e': {
                questions: [
                    { type: 'evaluation', subtype: 'experience', criteria: { id: 'e1', name: 'E1' } }
                ]
            },
            'm': {
                questions: [
                    { type: 'evaluation', subtype: 'motivation', criteria: { id: 'm1', name: 'M1' } }
                ]
            },
            'c': {
                questions: [
                    { type: 'evaluation', subtype: 'competency', criteria: { id: 'c1', name: 'C1' } }
                ]  
            },
            'cul': {
                questions: [
                    { type: 'evaluation', subtype: 'culture' }
                ]  
            },
            'hs': {
                questions: [
                    { type: 'evaluation', subtype: 'hard-skill', criteria: { id: 'hs1', name: 'HS1' } }
                ]  
            }
        }
    }

    const criterias = useMemo(() => {
        return getProjectEvaluationCriterias(project)
    }, [project])

    return <div>
        <pre>
            {JSON.stringify(values)}
        </pre>

        <ScoringRulesForm criteria={criterias} onValues={setValues} />
    </div>
}

export default ScoringRulesFormPreview;