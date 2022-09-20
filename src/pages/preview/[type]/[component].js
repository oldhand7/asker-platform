const { useState, useEffect } = require("react")
import BlankLayout from "layouts/blank/blank-layout";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Link from "next/link";
import classNames from "classnames";

import styles from 'styles/pages/preview.module.scss';

const components = {
    component: {
        'RuleInputField': dynamic(() => import('components/RuleInputField/RuleInputField')),
        'QuestionScoreInputField': dynamic(() => import('components/QuestionScoreInputField/QuestionScoreInputField')),
        'LazyInput': dynamic(() => import('components/LazyInput/LazyInputPreview')),
        'MinutesInput': dynamic(() => import('components/MinutesInput/MinutesInputPreview')),
        'TimedTitle': dynamic(() => import('components/TimedTitle/TimedTitlePreview')),
        'TextInput': dynamic(() => import('components/TextInput/TextInputPreview')),
        'DeepSelect': dynamic(() => import('components/DeepSelect/DeepSelectPreview')),
        'PopupMenu': dynamic(() => import('components/PopupMenu/PopupMenuPreview')),
        'StageTreeLeaf': dynamic(() => import('components/StageTreeLeaf/StageTreeLeafPreview')),
        'StageTree': dynamic(() => import('components/StageTree/StageTreePreview')),
        'ProjectStageTree': dynamic(() => import('components/ProjectStageTree/ProjectStageTreePreview')),
        'ProjectStageChoose': dynamic(() => import('components/ProjectStageChoose/ProjectStageChoosePreview')),
        'ProjectFormProcess': dynamic(() => import('components/ProjectFormProcess/ProjectFormProcessPreview')),
        'TimeLabel': dynamic(() => import('components/TimeLabel/TimeLabelPreview')),
        'InterviewerSelect': dynamic(() => import('components/InterviewerSelect/InterviewerSelectPreview')),
        'InterviewFormTimer': dynamic(() => import('components/InterviewFormTimer/InterviewFormTimerPreview')),
        'FileDropInputField': dynamic(() => import('components/FileDropInputField/FileDropInputFieldPreview')),
        'QuestionScoreBoard': dynamic(() => import('components/QuestionScoreBoard/QuestionScoreBoardPreview')),
        'FocusPopup': dynamic(() => import('components/FocusPopup/FocusPopupPreview'))
    },
    form: {
        'followup-question-form': dynamic(() => import('forms/followup-question/followup-question-form')),
        'admin-profile-form': dynamic(() => import('forms/admin-profile/admin-profile-form-preview')),
        'password-form': dynamic(() => import('forms/password/password-form')),
        'StageInterviewForm': dynamic(() => import('components/StageInterviewForm/StageInterviewFormPreview')),
        'stage-template-form': dynamic(() => import('forms/stage-template/stage-template-form-preview')),
        'tiny-input-form':  dynamic(() => import('forms/tiny-input/tiny-input-form-preview')),
        'introduction-stage-form': dynamic(() => import('forms/introduction-stage/introduction-stage-form-preview')),
        'FeatureFormPreview': dynamic(() => import('components/FeatureForm/FeatureFormPreview')),
        'summary-stage-form': dynamic(() => import('forms/summary-stage/summary-stage-form-preview')),
        'project-form': dynamic(() => import('forms/project/project-form-preview')),
        'company-presentation-stage-form': dynamic(() => import('forms/company-presentation-stage/company-presentation-stage-form-preview')),
        'scoring-rules-form': dynamic(() => import('forms/scoring-rules/scoring-rules-form-preview'))
    }
}

const labels = {
    component: 'Components',
    form: 'Forms'
}

const PreviewPage = () => {
    const router = useRouter();
    const [Component, setComponent] = useState(null);

    useEffect(() => {
        const { query } = router;

        if (query.type && query.component && components[query.type] && components[query.type][query.component]) {
            setComponent(components[query.type][query.component])
        } else {
            setComponent(null)
        }
    }, [router.query])

    const handleComponentTypeChange = (ev) => {
        if (ev.target.value) {
            router.push(`/preview/${ev.target.value}`)
        } else {
            router.push('/preview')
        }
    }

    return <div className={styles['preview']}>
        <div className={styles['preview-sidebar']}>
            <div className={styles["preview-widget"]}>
                <h3 className={styles["preview-widget-title"]}>Component type</h3>

                <select className={styles["preview-widget-select"]} onChange={handleComponentTypeChange} value={router.query.type}>
                    <option value="">-- Select --</option>
                    {Object.keys(components).map(comp => (<option key={comp} value={comp}>{labels[comp]}</option>))}
                </select>
            </div>

            {router.query.type ? 
            <div className={styles["preview-widget"]}>
                <h3 className={styles["preview-widget-title"]}>{labels[router.query.type]}</h3>
                
                <ul className={styles['preview-menu']}>
                {Object.keys(components[router.query.type]).map(comp => (
                    <li className={classNames(
                        styles['preview-menu-item'],
                        router && router.query.component == comp ? styles['preview-menu-item-active'] : ''
                    )} key={comp}><Link href={`/preview/${router.query.type}/${comp}`}>{comp}</Link></li>
                ))}
                </ul>
            </div> : null}
        </div>

        <div className={styles['preview-content']}>
            {Component ? <>
                <h1 className={styles['preview-title']}>{router && router.query.component}</h1>
                <Component />
            </> : 'Choose component.'}
        </div>
    </div>
}

PreviewPage.layout = BlankLayout;
PreviewPage.noAuth = true;
PreviewPage.fullWidth = true;

export default PreviewPage;