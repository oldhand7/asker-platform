const { default: FileDropInputField } = require("./FileDropInputField")

import { DbContext } from 'libs/db'
import { UserContext } from 'libs/user'
import { useState } from 'react'

import styles from './FileDropInputFieldPreview.module.scss'

const formats = {
  'pdf': ['application/pdf'],
  'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  'ppt': ['application/vnd.ms-powerpoint'],
  'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'xls': ['application/vnd.ms-excel'],
  'jpg': ['image/jpeg'],
  'png': ['image/png'],
  'jpeg': ['image/jpeg'],
  'gif': ['image/gif']
}

const FileDropInputFieldPreview = () => {
    const [limitFiles, setLimitFiles] = useState(3);
    const [limitBytes, setLimitBytes] = useState(5 * 1000000);
    const [uploads, setFiles] = useState([]);
    const [allowedFormats, setAllow] = useState(formats);
    const [limitFileSize, setLimitFileSize] = useState(1000000);

    const toggleFormat = k => {
        const copy = { ...allowedFormats }

        if (copy[k]) {
            delete copy[k]
        } else {
            copy[k] = formats[k]
        }

        setAllow(copy)
    }

    const docsApi = {
        uploadCompanyFile: () => Promise.resolve('https://placekitten.com/200/300')
    }

    const userApi = {
        user: { id: 'u1', name: 'User 1', companyId: 'u1c1' }
    }

    return <div>
        <div>
            <p>Limit bundle size</p>
            <button onClick={() => setLimitFiles(Math.max(limitFiles - 1, 0))}>-1 file</button>
            <button onClick={() => setLimitFiles(limitFiles + 1)}>+1 file</button>
        </div>
        <div>
            <p>Limit remaining bytes</p>
            <button onClick={() => setLimitBytes(Math.max(limitBytes - 1000000, 0))}>-1 MB</button>
            <button onClick={() => setLimitBytes(limitBytes + 1000000)}>+1 MB</button>
        </div>
        <div>
            <p>Limit file size</p>
            <button onClick={() => setLimitFileSize(Math.max(limitFileSize - 1000000, 0))}>-1 MB</button>
            <button onClick={() => setLimitFileSize(limitFileSize + 1000000)}>+1 MB</button>
        </div>
        <div>
            <ul>
                {Object.keys(formats).map(k => (
                    <li key={k}><label><input type="checkbox" checked={allowedFormats[k]} onChange={() => toggleFormat(k)} /> {formats[k]}</label></li>
                ))}
            </ul>
        </div>
        <pre>{JSON.stringify(uploads)}</pre>
        <p><strong>Limit files:</strong> {limitFiles}</p>
        <p><strong>Limit size:</strong> {limitBytes}b</p>
        <DbContext.Provider value={docsApi}>
            <UserContext.Provider value={userApi}>
            <FileDropInputField maxSingleFileSize={limitFileSize} multiple={true} onFiles={setFiles} className={styles['file-drop-input-field']} maxFilesPerUpload={limitFiles} bundleReminingBytes={limitBytes} allowed={allowedFormats} />
            </UserContext.Provider>
        </DbContext.Provider>
    </div>
}

export default FileDropInputFieldPreview;