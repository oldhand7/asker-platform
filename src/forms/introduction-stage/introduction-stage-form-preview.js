const { useState } = require("react")
const { default: IntroductionStageForm } = require("./introduction-stage-form")


const IntroductionStageFormPreview = () => {
    const [isSubmitted, setIsSubmitted] = useState(null);
    const [values, setValues] = useState(null)
    const [error, setError] = useState(null);

    return <div>
        <div>
            <button onClick={() => setIsSubmitted(!isSubmitted)}>Toggle isSubmitted</button>

            <div>
                <pre>{JSON.stringify(values)}</pre>
            </div>

            {error && <p style={{color: 'red'}}><strong>onError:</strong> {error.message}</p>}
        </div>
        <IntroductionStageForm onError={setError} values={values} onValues={setValues} isSubmitted={isSubmitted} test={1} />
    </div>
}

export default IntroductionStageFormPreview;