import InputField from 'components/InputField/InputField';
import {useDropzone} from 'react-dropzone'
import classNames from 'classnames';
import CloudUploadIcon from 'components/Icon/CloudUploadIcon';
import Uploader from 'rc-upload';
import { useUser } from 'libs/user';
import { UPLOAD_LIMIT_MB, BUNDLE_MAX_FILES } from 'libs/config';
import { useState, useEffect } from 'react';
import Preloader from 'components/Preloader/Preloader';
import { humanFileSize, ctxError, calcFileBundleSizeBytes, inExtension } from 'libs/helper';
import { useDocumentsApi } from 'libs/db';
import { useTranslation } from 'libs/translation';

import styles from './FileDropInputField.module.scss';

const defaultAllowed = {
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

const LIMITS = {
  maxSingleFileSize: UPLOAD_LIMIT_MB * 1024 * 1024,
  maxFilesPerUpload: 10
}

const FileDropInputField = ({
      maxFilesPerUpload = LIMITS.maxFilesPerUpload,
      maxSingleFileSize = LIMITS.maxSingleFileSize,
      bundleReminingBytes = 0,
      className,
      onFiles,
      allowed = defaultAllowed,
      ...props
    }) => {
    const { user } = useUser();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null);
    const { t } = useTranslation();

    const docsApi = useDocumentsApi();

    const validateFiles = files => {
      const allowedExtensions =  Object.keys(allowed);

      const fileExtensionsValid = files.every(file => {
        return inExtension(file.name, allowedExtensions)
      })

      if (!fileExtensionsValid) {
        setError(new Error(t('errors.upload.file-not-allowed')))

        return;
      }

      if (files.length > maxFilesPerUpload) {
        let message = t('errors.upload.file-count-limit')

        message = message.replace('[n]', files.length)
        message = message.replace('[m]', maxFilesPerUpload);

        setError(new Error(message))

        return;
      }

      const filesValid = files.every(file => {
        if (file.size > maxSingleFileSize) {
          return false;
        }

        return true;
      })

      if (!filesValid) {
        let message = t('errors.upload.file-size-limit');

        message = message.replace('[n]', humanFileSize(maxSingleFileSize))

        setError(new Error(message))

        return;
      }

      if (calcFileBundleSizeBytes(files) > bundleReminingBytes) {
        let message = t('errors.upload.file-size-remaining-limit')

        message = message.replace('[n]', humanFileSize(bundleReminingBytes))

        setError(new Error(message))

        return;
      }

      return true;
    }

    const onDrop = files => {
      if (!files.length) {
        setError(new Error(t('errors.upload.file-format')))
      }

      if (!validateFiles(files)) {
        return;
      }

      setLoading(true);

      uploadManyFiles(files)
        .then(filesUploaded => {
          if (filesUploaded.length) {
            setSuccess(t('success.upload'))
            onFiles(filesUploaded)
          }

          if (filesUploaded.length != files.length) {
            alert(t('errors.upload.server'))
          }
        })
        .catch(error => {
            setLoading(false);
            setError(ctxError(t('errors.upload'), error))
        })
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept: Object.values(allowed).map(mime => mime).join(', '),
      noClick: true
    })

    const uploadManyFiles = (files = []) => {
      return Promise.allSettled(files.map(f => docsApi.uploadCompanyFile(user.companyId, f, 'docs')))
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
      onError: error => {
        setError(ctxError(t('errors.upload'), error.message))
      },
      onSuccess: (files) => {
        setSuccess(t('success.upload'))
        onFiles(files)
      },
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
                alert(t('errors.upload.server'))
              }
            })
            .catch(error => {
                setError(ctxError(t('errors.upload'), error))
            })
        }
      },
      ...props
    }
  }

  useEffect(() => {
    if (error) {
      setSuccess(null)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      setError(null)

      let t = setTimeout(() => {
        setSuccess(null)
      }, 10000)

      return () => clearTimeout(t)
    }
  }, [success])

  useEffect(() => {
    if (error || success) {
      setLoading(false);
    }
  }, [error, success])

  return <InputField className={classNames(styles['file-drop-input-field'], className)} >
      <div data-test-id="file-upload-area" {...getRootProps()} >
        <div className={styles['file-drop-input-field-filearea']}>
          <p>
            <CloudUploadIcon className={styles['file-drop-input-field-icon']} />
          </p>
          <p>{t('headings.file-drag')}</p>
          <Uploader {...uploadProps()}><button disabled={loading} type="button" className={styles['file-drop-input-field-filearea-button']}>{t('actions.choose.file')}</button></Uploader>
          <p>{t('labels.upload.limit-single-size')}: {humanFileSize(maxSingleFileSize)}</p>
          <p>{t('labels.upload.limit-count')}: {maxFilesPerUpload}</p>
          <p>{t('headings.allowed-formats')}: {Object.keys(allowed).map(ext => `.${ext}`).join(', ') || '-'}</p>
          <input  {...getInputProps()}  />
        </div>
        {error ? <p className="form-error">{error.message}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
        {loading ? <Preloader /> : null}
      </div>
    </InputField>
}

export default FileDropInputField;
