import { useMemo, useRef, useState } from "react"
import StageInterviewForm from "./StageInterviewForm"
import { useForm } from "libs/react-hook-form";
import classNames from "classnames";

import styles from './StageInterviewFormPreview.module.scss'

const DemoCounterComp = ({ className = 'default', values, onValues, markComplete, stage, question }) => {
    const [count, setCount] = useState(values);

    return <div className={classNames(
        styles['preview-stage-component'],
        className,
    )} >
        <h2>This an example stage: {stage.id} {question ? question.id : ''}</h2>

        <div>
            <strong>Current count: {count}</strong>
        </div>

        <div>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button type="button" onClick={() => onValues(count)}>Report values</button>
            <button type="button" onClick={markComplete}>Report complete</button>
        </div>
    </div>
}

const stageHandlers = {
    counterA: DemoCounterComp,
    'competency-questions': DemoCounterComp
}

const stages = [
    { id: 'counterA', config: {} },
    { id: 'competency-questions', config: { questions: [{ id: 'Q1' }, { id: 'Q2' }] } },
]

const StageInterviewFormPreview = () => {
    const {
        values: statuses,
        input,
        setValue
    } = useForm({
        values: stages.reduce((values, s) => {
            let complete;

            if (s.config && s.config.questions) {
                complete = s.config.questions.reduce((result, q) => {
                    result[q.id] = false;

                    return result;
                }, {})
            } else {
                complete = false;
            }

            let _values;

            if (s.config && s.config.questions) {
                _values = s.config.questions.reduce((result, q) => {
                    result[q.id] = 0;

                    return result;
                }, {})
            } else {
                _values = 0;
            }

            values[s.id] = {
                values: _values,
                tax: 0,
                complete
            }

            return values;
        }, {})
    })

    const stats = useRef({})
    const [statsReady, setStatsReady] = useState({})

    useState(() => {
        const int = setInterval(() => {
            setStatsReady({ ...stats.current })
        }, 500)

        return () => clearInterval(int)
    }, [stats.current])

    const stageTaxHandlers = useMemo(() => {
        return stages.reduce((handlers, s) => {
            handlers[s.id] = q => {

                let key = `${s.id}`

                if (q) {
                    key = `${key}.${q.id}`
                }

                stats.current = {
                    ...stats.current,
                    [key]: typeof stats.current[key] !== "undefined" ? stats.current[key] + 1 : 1

                }
            }

            return handlers;
        }, {})
    }, [])

    const stageValuesHandlers = useMemo(() => {
        return stages.reduce((handlers, s) => {
            handlers[s.id] = val => {
                setValue(`${s.id}.values`, val)
            }

            return handlers;
        }, {})
    }, [setValue])

    const stageCompleteHandlers = useMemo(() => {
        return stages.reduce((handlers, s) => {
            handlers[s.id] = q => {
                if (s.config && s.config.questions) {
                    setValue(`${s.id}.complete.${q.id}`, true)
                } else {
                    setValue(`${s.id}.complete`, true)
                }
            }

            return handlers;
        }, {})
    }, [setValue])

    return <div className={styles['preview']}>
        <table border="1">
            <tbody>
                <tr><th>Name</th><th>Tax</th><th>Complete</th><th>Values</th></tr>
                {
                    stages.map(s => {
                        if (s.config && s.config.questions) {
                            return s.config.questions.map(q => <tr key={`${s.id}-${q.id}`}>
                                <td>{s.id}.{q.id}</td>
                                <td>{statsReady[`${s.id}.${q.id}`] || 0}s</td>
                                <td>{statuses[s.id].complete[q.id] ? 'Y' : 'N'}</td>
                                <td>{statuses[s.id].values[q.id]}</td>
                            </tr>);
                        }

                        return <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{statsReady[s.id]}s</td>
                            <td>{statuses[s.id].complete ? 'Y' : 'N'}</td>
                            <td>{statuses[s.id].values}</td>
                        </tr>
                    })
                }</tbody>
        </table>

        {
            stages.map((s, index) => {
                return <StageInterviewForm
                    key={s.id}
                    className={styles['preview-stage']}
                    taxStageSecond={stageTaxHandlers[s.id]}
                    id={s.id}
                    values={statuses[s.id].values}
                    onValues={stageValuesHandlers[s.id]}
                    markComplete={stageCompleteHandlers[s.id]}
                    stage={s}
                    stages={stageHandlers} />
            })
        }
    </div>
}

export default StageInterviewFormPreview;