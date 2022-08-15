import classNames from 'classnames';
import TrashButton from 'components/TrashButton/TrashButton';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import InterviewDetailsRow from 'components/InterviewDetailsRow/InterviewDetailsRow';
import { scoreMap } from 'libs/scoring';
import { useEffect, useState } from 'react';
import { COLOR_MAP } from 'libs/config';
import EvaluationScoreBar from 'components/EvaluationScoreBar/EvaluationScoreBar'
import { getStageKey } from 'libs/stage'
import ScreeningEvaluationsList from 'components/ScreeningEvaluationsList/ScreeningEvaluationsList'
import EvaluationCriteriaList from 'components/EvaluationCriteriaList/EvaluationCriteriaList';

import style from './ProjectInterviewCompare.module.scss';

const labels = {
    'screening-questions': 'Screening',
    'other-questions': 'Other',
    'competency': 'Competencies',
    'screening': 'Screening',
    'hard-skill': 'Hard-skill',
    'motivation': 'Motivation',
    'culture-fit': 'Culture-fit',
    'experience': 'Experience'
}

const ProjectInterviewCompare = ({ className, compare = [], interviews = [], project, onCompareAdd, onCompareRemove }) => {
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const details = []

        const adjustedCompare = compare.map(c => {
            c.scoreMap = scoreMap(c, project)

            const otherQuestions = {
                'screening-questions': [],
                'other-questions': []
            };

            for (let i = 0; i < project.stages.length; i++) {
              if (['screening-questions', 'other-questions'].indexOf(project.stages[i].id) == -1) {
                continue;
              }

              const key = getStageKey(project.stages[i])

              if (c.evaluations && c.evaluations[key]) {

                for (const qid in c.evaluations[key]) {
                  const { config } = project.stages[i];

                  const question = config.questions.find(q => q.id == qid)

                  if (question) {
                    otherQuestions[project.stages[i].id].push({
                      question: question,
                      answer: c.evaluations[key][qid]
                    })
                  }
                }
              }
            }

            c.otherQuestions = otherQuestions;

            return c;
        })

        if (adjustedCompare.some(c => c.scoreMap['competency'].score)) {
            details.push({
                type: 'competency',
                evaluations: adjustedCompare.map(c => c.scoreMap['competency'])
            })
        }

        if (adjustedCompare.some(c => c.otherQuestions['screening-questions'].length)) {
            details.push({
                type: 'screening-questions',
                evaluations: adjustedCompare.map(c => c.otherQuestions['screening-questions'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['hard-skill'].score)) {
            details.push({
                type: 'hard-skill',
                evaluations: adjustedCompare.map(c => c.scoreMap['hard-skill'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['motivation'].score)) {
            details.push({
                type: 'motivation',
                evaluations: adjustedCompare.map(c => c.scoreMap['motivation'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['culture-fit'].score)) {
            details.push({
                type: 'culture-fit',
                evaluations: adjustedCompare.map(c => c.scoreMap['culture-fit'])
            })
        }

        if (adjustedCompare.some(c => c.scoreMap['experience'].score)) {
            details.push({
                type: 'experience',
                evaluations: adjustedCompare.map(c => c.scoreMap['experience'])
            })
        }

        if (adjustedCompare.some(c => c.otherQuestions['other-questions'].length)) {
            details.push({
                type: 'other-questions',
                evaluations: adjustedCompare.map(c => c.otherQuestions['other-questions'])
            })
        }

        setDetails(details)
    }, [compare, project])

    return <div data-test-id="project-interview-compare" className={classNames(
        style['project-interview-compare'],
        className
    )}>
        <div className={style['project-interview-compare-head']}>
            {compare.map(c => {
                const table = scoreMap(c, project)

                return <div key={c.id} className={style['project-interview-compare-candidate']}>
                    <div className={style['project-interview-compare-candidate-compact']}>
                        <h4 className={style['project-interview-compare-candidate-title']}>{project.anonimize ? c.candidate.alias : c.candidate.name}</h4>
                        <InterviewScore className={style['project-interview-compare-candidate-score']} score={c.score || 0} />
                        <TrashButton onClick={() => onCompareRemove(c)} className={style['project-interview-compare-candidate-trash']} />
                    </div>
                </div>
            })}
            {interviews.length > compare.length ?
            <div className={classNames(
                style['project-interview-compare-candidate'],
                style['project-interview-compare-candidate-dummy']
            )}>
                <button onClick={onCompareAdd} className={style['project-interview-compare-add-candidate']}>+ Add candidate</button>
            </div> : null}
        </div>
        {details.map(({ type, evaluations }) => {

            if (type == 'screening-questions' || type == 'other-questions') {
                return <InterviewDetailsRow
                key={type}
                className={style['project-interview-compare-details']}
                headerColumnWidth={20}
                defaultOpen={true}
                head={null}
                name={labels[type]}>
                    <div className={style['project-interview-compare-details-body']}>
                        {evaluations.map((evaluation, index) => <div key={`${type}-${index}`} style={{flex: `0 0 ${100 / (interviews.length > compare.length ? compare.length + 1 : compare.length)}%`}}>
                            <ScreeningEvaluationsList className={style['project-interview-compare-details-criteria-list']} evaluations={evaluation} /></div>)}
                    </div>
                </InterviewDetailsRow>
            }

            const flexCompactStyle = {
                flex: `0 0 ${100 / (interviews.length > compare.length ? compare.length + 1 : compare.length)}%`
            }

            return <InterviewDetailsRow
            key={type}
            className={style['project-interview-compare-details']}
            headerColumnWidth={20}
            defaultOpen={true}
            head={<div className={style['project-interview-compare-details-head']}>
                {evaluations.map((evaluation, index) => <div key={`${type}-${index}`} style={flexCompactStyle}><EvaluationScoreBar
                    className={style['project-interview-compare-details-head-bar']}
                    value={evaluation.score} color={COLOR_MAP[type]} /></div>)}
                {interviews.length > compare.length ? <div style={flexCompactStyle}></div> : null}
            </div>}
            name={labels[type]}>
                {type != 'motivation' && type != 'culture-fit' ?
                <div className={style['project-interview-compare-details-body']}>
                    {evaluations.map((evaluation, index) => <div className={style['project-interview-compare-details-column']} key={`${type}-${index}`} style={flexCompactStyle}>
                        <EvaluationCriteriaList className={style['project-interview-compare-details-criteria-list']} evaluation={evaluation} /></div>)}
                </div> : null}
            </InterviewDetailsRow>
        })}
    </div>
}

export default ProjectInterviewCompare;
