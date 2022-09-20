import classNames from 'classnames';
import ResetIcon from 'components/Icon/ResetIcon';
import { featureTypes } from 'libs/features';
import { useTranslation } from 'libs/translation';

import styles from './ProjectStageChoose.module.scss';

const ProjectStageChoose = ({ className, onChoose, onClose }) => {
    const { t } = useTranslation();
    
    return <div className={classNames(
        styles['project-stage-choose'],
        className
        )}>

        <div className={styles['project-stage-choose-head']}>
            <h3 className={styles['project-stage-choose-title']}>{t('actions.add.interview-stage')}</h3>
            <button type="button" onClick={onClose} className={styles['project-stage-choose-close']}>
                <ResetIcon className={styles['project-stage-close-icon']} />
            </button>
        </div>

        <div className={styles['project-stage-choose-body']}>
            {
                featureTypes.map(ft => {
                    return <div key={ft.id} className={styles['project-stage-choose-stage-group']}>
                         <h4 className={styles['project-stage-choose-stage-group-title']}>
                                {t(ft.name)}
                        </h4>

                        <ul className={styles['project-stage-choose-stage-group-list']}>
                            {ft.features.map(f => (
                                <li key={f.id} onClick={() => onChoose && onChoose(f)} className={styles['project-stage-choose-stage-group-list-item']}>
                                    {t(`stages.${f.id}.name`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                })
            }
        </div>
    </div>
}

export default ProjectStageChoose;