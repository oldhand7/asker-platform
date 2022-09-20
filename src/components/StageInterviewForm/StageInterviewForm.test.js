const { render } = require("@testing-library/react")
const { useEffect } = require("react")
const { default: StageInterviewForm } = require("./StageInterviewForm")
import React from "react";

describe('StageInterviewForm', () => {
    it('should wrap a component in an interactive-timed container', () => {
        const ComponentA = ({ className, values, onValues, markComplete }) => {
            useEffect(() => {
                onValues(321)
            }, [onValues])

            useEffect(() => {
                markComplete()
            }, [markComplete])

            return <div className={className}>ComponentA{values}</div>
        }

        const stages = {
            ComponentA
        }

        const project = {
            stages: [
                { id: 'ComponentA', config: { time: 22 } }
            ]
        }

        const onValues = jest.fn();
        const markComplete = jest.fn()

        const {
            container,
        } = render(<StageInterviewForm className='testclass' id='componenta' values={123} onValues={onValues} markComplete={markComplete} stage={project.stages[0]} stages={stages} />)

        const stageWindow = container.querySelector('#stage-componenta')

        expect(stageWindow.classList.contains('testclass')).toBeTruthy();

        expect(stageWindow).toHaveTextContent('22m');
        expect(stageWindow).toHaveTextContent('ComponentA123');

        expect(onValues).toHaveBeenCalledTimes(1);
        expect(onValues.mock.calls[0][0]).toBe(321);
        expect(markComplete).toHaveBeenCalled();
    })

    it('should expand question stages such that each questions a stage', () => {
        const DemoComponent = ({ question }) => {
            return <div>DemoComponent-{question.id}</div>
        }

        const stageComponentMap = {
            'competency-questions': DemoComponent,
            'hard-skill-questions': DemoComponent,
            'experience-questions': DemoComponent,
            'motivation-questions': DemoComponent,
            'culture-questions': DemoComponent
        }

        const stages = [
            {
                id: 'competency-questions',
                config: {
                    questions: [
                        { id: 'CQ1' },
                        { id: 'CQ2' }
                    ]
                }
            },
            {
                id: 'hard-skill-questions',
                config: {
                    questions: [
                        { id: 'HSQ1' },
                        { id: 'HSQ2' }
                    ]
                }
            },
            {
                id: 'experience-questions',
                config: {
                    questions: [
                        { id: 'EQ1' },
                        { id: 'EQ2' }
                    ]
                }
            },
            {
                id: 'motivation-questions',
                config: {
                    questions: [
                        { id: 'MQ1' },
                        { id: 'MQ2' }
                    ]
                }
            },
            {
                id: 'culture-questions',
                config: {
                    questions: [
                        { id: 'CULQ1' },
                        { id: 'CULQ2' }
                    ]
                }
            }
        ]


        const {
            container
        } = render(
            <div>
                <StageInterviewForm id='democomponent' stage={stages[0]} stages={stageComponentMap} />
                <StageInterviewForm id='democomponent' stage={stages[1]} stages={stageComponentMap} />
                <StageInterviewForm id='democomponent' stage={stages[2]} stages={stageComponentMap} />
                <StageInterviewForm id='democomponent' stage={stages[3]} stages={stageComponentMap} />
                <StageInterviewForm id='democomponent' stage={stages[4]} stages={stageComponentMap} />
            </div>
        )

        const episodes = [
            container.querySelector('#stage-democomponent-CQ1'),
            container.querySelector('#stage-democomponent-CQ2'),
            container.querySelector('#stage-democomponent-HSQ1'),
            container.querySelector('#stage-democomponent-HSQ2'),
            container.querySelector('#stage-democomponent-EQ1'),
            container.querySelector('#stage-democomponent-EQ2'),
            container.querySelector('#stage-democomponent-MQ1'),
            container.querySelector('#stage-democomponent-MQ2'),
            container.querySelector('#stage-democomponent-CULQ1'),
            container.querySelector('#stage-democomponent-CULQ2'),
        ]

        expect(episodes[0]).toHaveTextContent('DemoComponent-CQ1')
        expect(episodes[1]).toHaveTextContent('DemoComponent-CQ2')
        expect(episodes[2]).toHaveTextContent('DemoComponent-HSQ1')
        expect(episodes[3]).toHaveTextContent('DemoComponent-HSQ2')
        expect(episodes[4]).toHaveTextContent('DemoComponent-EQ1')
        expect(episodes[5]).toHaveTextContent('DemoComponent-EQ2')
        expect(episodes[6]).toHaveTextContent('DemoComponent-MQ1')
        expect(episodes[7]).toHaveTextContent('DemoComponent-MQ2')
        expect(episodes[8]).toHaveTextContent('DemoComponent-CULQ1')
        expect(episodes[9]).toHaveTextContent('DemoComponent-CULQ2')
    })
})