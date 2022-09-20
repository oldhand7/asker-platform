import { fireEvent, render, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ProjectFormProcess from './ProjectFormProcess';

describe('ProjectFormProcess', () => {
    it('should provide an interface for stage selection and control', async () => {
        const onChange = jest.fn();
        const onStage = jest.fn();

        const stages = [
            { id: 'introduction', config: { time: 11 }},
            { id: 'company-presentation', config: { time: 22 }}
        ]

        const {
            container,
            queryAllByTestId,
            getByText,
            debug
        } = render(<ProjectFormProcess stage={stages[0]}  stages={stages} onChange={onChange} onStage={onStage} />)

        expect(container).toHaveTextContent('Process')

        const stageItems = queryAllByTestId('stage-tree-leaf')

        expect(stageItems).toHaveLength(2)

        expect(stageItems[0]).toHaveTextContent('Introduction')
        expect(stageItems[0]).toHaveTextContent('11m')
        expect(stageItems[0]).toHaveAttribute('data-status', 'active')
        expect(stageItems[1]).toHaveTextContent('Company')
        expect(stageItems[1]).toHaveTextContent('22m')

        await act(() => {
            fireEvent.click(stageItems[1])
            
            return Promise.resolve()
        })

        const companyStageWrapper = stageItems[1].closest('li')

        const {
            getByRole: getByRoleWithinStage,
            getByText: getByTextWithinItem
        } = within(companyStageWrapper)

        const popupButton = getByRoleWithinStage('button')

        await act(() => {
            fireEvent.click(popupButton)
            
            return Promise.resolve()
        })

        const deleteOpt = getByTextWithinItem('Delete')

        await act(() => {
            fireEvent.click(deleteOpt)
            
            return Promise.resolve()
        })

        const addStageButton = getByText('Add interview stage')

        await act(() => {
            fireEvent.click(addStageButton)
            
            return Promise.resolve()
        })

        const summaryItem = getByText('Summary')

        await act(() => {
            fireEvent.click(summaryItem)
            
            return Promise.resolve()
        })

        const stageItemsAfter = queryAllByTestId('stage-tree-leaf')

        expect(stageItemsAfter[0]).toHaveTextContent('Introduction')
        expect(stageItemsAfter[1]).toHaveTextContent('Summary')
        expect(stageItemsAfter[1]).toHaveTextContent('5m')

        expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(3)
        expect(onChange.mock.calls.length).toBeLessThan(10)

        expect(onChange.mock.calls[onChange.mock.calls.length-1][0][1].id).toEqual('summary')

        expect(onStage).toHaveBeenCalledTimes(2)

        expect(onStage.mock.calls[0][0].id).toEqual('company-presentation')
        expect(onStage.mock.calls[1][0].id).toEqual('summary')
    })
})