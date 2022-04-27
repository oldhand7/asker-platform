import Modal, { createModalElement } from 'components/Modal/Modal';
import ProjectTemplateForm from 'forms/project-template/project-template-form';
import ReacDOM from 'react-dom';
import { useSite } from 'libs/site';

import styles from './project-template-modal.module.scss';

const ProjectTemplateModal = ({ onResult, ...props }) => {
  return <Modal {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <ProjectTemplateForm close={() => onResult(null, true)} onValues={val => onResult(val, true)} />
  </Modal>
}

export default ProjectTemplateModal;
