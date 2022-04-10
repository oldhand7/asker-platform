import InputField from 'components/InputField/InputField';
import {useDropzone} from 'react-dropzone'
import classNames from 'classnames';
import { useCallback} from 'react';
import Uploader from 'components/Uploader/Uploader';
import CloudUploadIcon from 'components/Icon/CloudUploadIcon';

import styles from './FileDropInputField.module.scss';

const FileDropInputField = ({ className, onChange, onError, ...props }) => {
    const onDrop = useCallback(acceptedFiles => {
      //@TODO
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  const uploadProps = {
    //@TODO
    beforeUpload: async (file) => {
      return Promise.reject();
    },
    onError
  }

  return <InputField className={classNames(styles['file-drop-input-field'], className)} {...props} >
    <div className={styles['file-drop-input-field-filearea']}>
      <p>
        <CloudUploadIcon className={styles['file-drop-input-field-icon']} />
      </p>
      <p>Drag and Drop files here</p>
      <Uploader><button className={styles['file-drop-input-field-filearea-button']}>Choose file</button></Uploader>
      <p>Maximum file size 5MB</p>
    </div>
  </InputField>
}

export default FileDropInputField;
