import { fireEvent, render, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ProjectStageTree from './ProjectStageTree';

describe('ProjectStageTree', () => {
    it('should draw a tree-like structure for stage summary with controls', async () => {
        const stages = [
            { id: 'introduction', config: { time: 11 } },
            { id: 'competency-questions', config: { time: 22, questions: [{ id: 'cq1', name: 'C1Q?', criteria: { id: 'c1', name: 'C1'}}] } },
            { id: 'screening-questions', config: { time: 33, questions: [{id: 'sq1', name: 'SQ1?'}, {id: 'sq2', name: 'SQ2?'}] } },
            { id: 'summary', config: { time: 44 } }
        ]

        const onChange = jest.fn();
        const onStage = jest.fn();

        const {
            container,
            getByTestId,
            getByText,
            debug
        } = render(<ProjectStageTree className='testclass' stages={stages} onStage={onStage} onChange={onChange} />);

        expect(container.firstChild.classList.contains('testclass')).toBe(true);

        const topLevelMenu = getByTestId('project-stage-tree')

        expect(topLevelMenu.children.length).toEqual(4)
        
        expect(topLevelMenu.children[0]).toHaveTextContent('Introduction');
        expect(topLevelMenu.children[0]).toHaveTextContent('11m');
        expect(topLevelMenu.children[1]).toHaveTextContent('Competency (1)');
        expect(topLevelMenu.children[1]).toHaveTextContent('22m');
        expect(topLevelMenu.children[2]).toHaveTextContent('Screening (2)');
        expect(topLevelMenu.children[2]).toHaveTextContent('33m');
        expect(topLevelMenu.children[3]).toHaveTextContent('Summary');
        expect(topLevelMenu.children[3]).toHaveTextContent('44m');

        const leafs = [
            getByText('Introduction'),
            getByText('Competency (1)'),
            getByText('Screening (2)'),
            getByText('Summary')
        ]

        await act(() => {
            fireEvent.click(leafs[3])
            fireEvent.click(leafs[2])
            fireEvent.click(leafs[1])
            fireEvent.click(leafs[0])

            return Promise.resolve();
        })

        const criteriaLabel = getByText('C1 (1)')

        await act(() => {
            fireEvent.click(criteriaLabel)

            return Promise.resolve();
        })

        const criteriaWrapper = criteriaLabel.closest('li')

        expect(criteriaWrapper.children[1].children.length).toEqual(1)
        expect(criteriaWrapper.children[1].children[0]).toHaveTextContent('C1Q?')

        const screningWrapper = getByText('Screening (2)').closest('li')

        expect(screningWrapper.children[1].children.length).toEqual(2)
        expect(screningWrapper.children[1].children[0]).toHaveTextContent('SQ1?')
        expect(screningWrapper.children[1].children[1]).toHaveTextContent('SQ2?')

        const summaryWrapper = getByText('Summary').closest('li')

        const {
            getByRole: getByRoleWithinSummary,
            getByText: getByTextWithinSummary
        } = within(summaryWrapper)

        await act(() => {
            fireEvent.click(getByRoleWithinSummary('button'))
            fireEvent.click(getByTextWithinSummary('Delete'))

            return Promise.resolve();
        })

        expect(onStage).toHaveBeenCalledTimes(4);

        expect(onStage.mock.calls[0][0].id).toEqual('summary');
        expect(onStage.mock.calls[1][0].id).toEqual('screening-questions');
        expect(onStage.mock.calls[2][0].id).toEqual('competency-questions');
        expect(onStage.mock.calls[3][0].id).toEqual('introduction');

        expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(1)
        expect(onChange.mock.calls.length).toBeLessThan(5)
    })
})