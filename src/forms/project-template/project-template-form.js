import classNames from 'classnames';
import TemplateExplorer from 'components/TemplateExplorer/TemplateExplorer';
import { useRouter } from 'next/router';

import styles from './project-template-form.module.scss';

const ProjectTemplateForm = ({ className, onValues, close }) => {
  const router = useRouter();

  const handleTemplateChoice = (t) => {
    if (t) {
      router.push(`/projects/create/?template=${t.id}`)
    }

    close(t)
  }

  return <div className={classNames(styles['project-template-form'], classNames)}>
    <TemplateExplorer className={styles['project-template-form-explorer']} onTemplate={handleTemplateChoice} />
  </div>
}

export default ProjectTemplateForm;
