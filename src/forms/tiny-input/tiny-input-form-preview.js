import { useState } from "react";
import TinyInputForm  from "./tiny-input-form"

const TinyInputFormPreview = () => {
    const [value, setValue] = useState('some');

    return <div>
        <p><strong>Result:</strong> {value}</p>
        <TinyInputForm className="justsomeclass" values={{value}} onValues={({value}) => setValue(value)} requiredMessage="Hey this field is required!" placeholder="Type type type" buttonLabel="Save yourselves!" />
    </div>
}

export default TinyInputFormPreview;