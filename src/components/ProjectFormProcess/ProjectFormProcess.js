import classNames from "classnames";
import { useMemo, useState, useCallback, memo } from "react";
import ProjectStageTree from 'components/ProjectStageTree/ProjectStageTree';
import ProjectStageChoose from 'components/ProjectStageChoose/ProjectStageChoose';
import { v4 as uuidv4 } from 'uuid';
import PlusIcon from "components/Icon/PlusIcon";
import { useTranslation } from "libs/translation";
import { DEFAULT_STAGE_TIME } from "libs/config";

import styles from './ProjectFormProcess.module.scss';

const ProjectFormProcess = ({ className, stages = [], onStageAdd, stage, onChange, errors = {}, onStage, config = {} }) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState('stage-control')

    const handleStageChoose = useCallback((stage) => {
        setMode('stage-control')
        onStageAdd({
            ...stage,
            uid: uuidv4()
        });
    }, [onStageAdd])

    const timetable = useMemo(() => {
        const timetable = {}

        for (let key in config) {
            timetable[key] = config[key] && config[key].time;
        }

        return timetable;
    }, [config])

    return <div data-test-id="project-process" className={classNames(styles['project-form-process'], className)}>
        <div className={styles['project-form-process-head']}>
            <h3 className={styles['project-form-process-title']}>{t('labels.process')}</h3>
            <button type="button" onClick={() => setMode('stage-choose')} className={styles['project-form-process-add-stage']}>
                <PlusIcon className={styles['project-form-process-add-stage-icon']} />
                <span className={styles['project-form-process-add-stage-text']}>{t('actions.add.interview-stage')}</span>
            </button>
        </div>
        <div className={styles['project-form-process-body']}>
            {mode == 'stage-control' && <ProjectStageTree timetable={timetable} errors={errors} stage={stage} onChange={onChange} onStage={onStage} stages={stages} className={styles['project-from-process-stage-tree']} />}
            {mode == 'stage-choose' && <ProjectStageChoose  onChoose={handleStageChoose} onClose={() => setMode('stage-control')} className={styles['project-form-process-stage-choose']} />}
        </div>
    </div>
}

export default ProjectFormProcess;