import InputField from 'components/InputField/InputField';
import {useDropzone} from 'react-dropzone'
import classNames from 'classnames';
import { useCallback} from 'react';
import CloudUploadIcon from 'components/Icon/CloudUploadIcon';
import Uploader from 'rc-upload';
import { useUser } from 'libs/user';
import { uploadCompanyFile } from 'libs/firestorage';
import { UPLOAD_LIMIT_MB } from 'libs/config';
import { useState, useEffect } from 'react';
import Preloader from 'components/Preloader/Preloader';

import styles from './FileDropInputField.module.scss';

const allowed = {
  'pdf': ['application/pdf']
}

const MAX_UPLOAD_COUNT = 4;

const FileDropInputField = ({ files = [], className, onFiles, ...props }) => {
    const onDrop = useCallback(acceptedFiles => {
      //@TODO
    }, [])

    const [user] = useUser();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const uploadProps = () => {
    let files = [];

    return {
      beforeUpload: async (file) => {
        if (file.size > UPLOAD_LIMIT_MB * 1000000) {
          return Promise.reject();
        }

        files.push(file);

        return Promise.resolve(file)
      },
      onError: setError,
      onSuccess: onFiles,
      multiple: true,
      accept: Object.values(allowed).map(mime => mime).join(', '),
      customRequest: async ({ file, onError, onSuccess }) => {
        if (files.indexOf(file) === files.length -1) {
          if (files.length > MAX_UPLOAD_COUNT) {
            onError(new Error(`Uploading more than ${MAX_UPLOAD_COUNT} files not allowed.`))
            setLoading(false);

            return;
          }

          setLoading(true);

          Promise.allSettled(files.map(f => uploadCompanyFile(user.companyId, f, 'docs')))
            .then(result => {
              const filesUploaded = [];

              for (let i = 0; i < result.length; i++) {
                if (result[i]['status'] == 'fulfilled') {
                  filesUploaded.push({
                    name: files[i].name,
                    size: files[i].size,
                    url: result[i].value,
                    type: files[i].type
                  })
                }
              }

              if (filesUploaded.length) {
                onSuccess(filesUploaded)
              }

              if (filesUploaded.length != files.length) {
                onError(new Error("Some files were not uploaded"))
              }

              setLoading(false);
            })
        }
      }
    }
  }

  useEffect(() => {
    setError(null);
  }, [loading])

  return <InputField className={classNames(styles['file-drop-input-field'], className)} {...props} >
      <div className={styles['file-drop-input-field-filearea']}>
        <p>
          <CloudUploadIcon className={styles['file-drop-input-field-icon']} />
        </p>
        <p>Drag and Drop files here</p>
        <Uploader {...uploadProps()}><button disabled={loading} type="button" className={styles['file-drop-input-field-filearea-button']}>Choose file</button></Uploader>
        <p>Maximum file size {UPLOAD_LIMIT_MB}MB</p>
        <p>Allowed formats: {Object.keys(allowed).map(ext => `.${ext}`).join(', ')}</p>
      </div>
      {error ? <p className="form-error">{error.message}</p> : null}
      {loading ? <Preloader /> : null}
    </InputField>
}

export default FileDropInputField;
