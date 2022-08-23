import { useRecordContext } from 'react-admin';

const ComputeField = ({ compute }) => {
    const record = useRecordContext();
    return compute ? compute(record) : null;
}

export default ComputeField;
