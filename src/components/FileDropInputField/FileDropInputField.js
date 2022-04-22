import InputField from 'components/InputField/InputField';
import {useDropzone} from 'react-dropzone'
import classNames from 'classnames';
import { useCallback} from 'react';
import CloudUploadIcon from 'components/Icon/CloudUploadIcon';
import Uploader from 'rc-upload';
import { useUser } from 'libs/user';
import { uploadCompanyFile } from 'libs/firestorage';
import { UPLOAD_LIMIT_MB, BUNDLE_UPLOAD_LIMIT_MB, BUNDLE_MAX_FILES } from 'libs/config';
import { useState, useEffect } from 'react';
import Preloader from 'components/Preloader/Preloader';
import { humanFileSize, ctxError, calcFileBundleSizeBytes } from 'libs/helper';

import styles from './FileDropInputField.module.scss';

const defaultAllowed = {
  'pdf': ['application/pdf'],
  'jpg': ['image/jpeg'],
  'png': ['image/png'],
  'jpeg': ['image/jpeg'],
  'gif': ['image/gif']
}

const MAX_UPLOAD_COUNT = 10;

const FileDropInputField = ({ bundleReminingBytes = 0, className, onFiles, allowed = defaultAllowed, ...props }) => {
    const { user } = useUser();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const validateFiles = files => {
      if (files.length > BUNDLE_MAX_FILES) {
        alert(`Max ${BUNDLE_MAX_FILES} files!`)

        return;
      }

      if (calcFileBundleSizeBytes(files) > bundleReminingBytes) {
        alert('Total size of exceeds allowed remining size - ' + humanFileSize(bundleReminingBytes))
      }

      const filesValid = files.every(file => {
        if (file.size > UPLOAD_LIMIT_MB * 1000000) {
          return false;
        }

        return true;
      })

      if (!filesValid) {
        alert('Files not accepted. Some files are larger than ' + humanFileSize(UPLOAD_LIMIT_MB * 1000000))

        return;
      }

      return true;
    }

    const onDrop = files => {
      if (!files.length) {
        alert('File format not accepted.')
      }

      if (!validateFiles(files)) {
        return;
      }

      setLoading(true);

      uploadManyFiles(files)
      .then(filesUploaded => {
        if (filesUploaded.length) {
          onFiles(filesUploaded)
        }

        if (filesUploaded.length != files.length) {
          setError(new Error("Some files were not uploaded"))
        }

        setLoading(false);
      })
      .catch(error => {
          setLoading(false);
          setError(ctxError("File upload failed", error))
      })
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept: Object.values(allowed).map(mime => mime).join(', '),
      noClick: true
    })

    const uploadManyFiles = (files = []) => {
      return Promise.allSettled(files.map(f => uploadCompanyFile(user.companyId, f, 'docs')))
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

          return filesUploaded;;
        })
    }

  const uploadProps = () => {
    let files = [];

    return {
      beforeUpload: async (file) => {
        files.push(file);
        return Promise.resolve(file)
      },
      onError: setError,
      onSuccess: onFiles,
      multiple: true,
      accept: Object.values(allowed).map(mime => mime).join(', '),
      customRequest: async ({ file, onError, onSuccess }) => {
        if (files.indexOf(file) === files.length -1) {
          if (!validateFiles(files)) {
            return;
          }

          setLoading(true);

          uploadManyFiles(files)
            .then(filesUploaded => {
              if (filesUploaded.length) {
                onSuccess(filesUploaded)
              }

              if (filesUploaded.length != files.length) {
                onError(new Error("Some files were not uploaded"))
              }

              setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                onError(ctxError("File upload failed", error))
            })
        }
      },
      ...props
    }
  }

  useEffect(() => {
    setError(null);
  }, [loading])

  return <InputField className={classNames(styles['file-drop-input-field'], className)} >
      <div className={styles['file-drop-input-field-filearea']} {...getRootProps()}>
        <p>
          <CloudUploadIcon className={styles['file-drop-input-field-icon']} />
        </p>
        <p>Drag and Drop files here</p>
        <Uploader {...uploadProps()}><button disabled={loading} type="button" className={styles['file-drop-input-field-filearea-button']}>Choose file</button></Uploader>
        <p>Maximum file size: {UPLOAD_LIMIT_MB}MB</p>
        <p>Max upload files: {BUNDLE_MAX_FILES}</p>
        <p>Allowed formats: {Object.keys(allowed).map(ext => `.${ext}`).join(', ')}</p>
        <input  {...getInputProps()} style={{ display: 'none'}} />
      </div>
      {error ? <p className="form-error">{error.message}</p> : null}
      {loading ? <Preloader /> : null}
    </InputField>
}

export default FileDropInputField;
