import { DEFAULT_STAGE_TIME } from 'libs/config';

export const getStageKey = s => `${s.id}_${s.uid}`

export const getStageTime = stage => {
    if (stage && stage.config && stage.config.questions && !stage.time) {
        return Number.parseInt(stage.config.questions.length * 5 || DEFAULT_STAGE_TIME);
    }

    return Number.parseInt(stage.time || DEFAULT_STAGE_TIME);
}