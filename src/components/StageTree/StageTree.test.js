import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import StageTree from './StageTree'

describe('StageTree', () => {
    it('should draw a tree repesenation of a stage with controls', async () => {
        const stage = {
            id: 'competency-questions',
            config: {
                questions: [
                    { id: 'cq1', name: 'CQ1', criteria: { id: 'ca', name: 'CA' }},
                    { id: 'cq2', name: 'CQ2', criteria: { id: 'ca', name: 'CA' }},
                    { id: 'cq3', name: 'CQ3', criteria: { id: 'cb', name: 'CB' }},
                ],
                time: '15'
            }
        }

        const actions = [
            { id: 'delete', name: 'Delete' }
        ]

        const onDelete = jest.fn();

        const {
            container,
            getByText,
            debug
        } = render(<StageTree className='testclass' stage={stage} actions={actions} onDelete={onDelete} />)

        expect(container.firstChild.classList.contains('testclass')).toBe(true)

        const competencyLabel = getByText('Competency (2)')

        await act(() => {
            fireEvent.click(competencyLabel)

            return Promise.resolve();
        })

        const competencyWrapper = competencyLabel.closest('li')

        expect(competencyWrapper).toHaveTextContent('15m')

        const popupMenuTrigger = competencyWrapper.querySelector('button')

        await act(() => {
            fireEvent.click(popupMenuTrigger)

            return Promise.resolve();
        })

        const popupMenu = competencyWrapper.querySelector('ul');

        expect(popupMenu.firstChild).toHaveTextContent('Delete')

        await act(() => {
            fireEvent.click(popupMenu.firstChild)

            return Promise.resolve();
        })

        expect(competencyWrapper.children[1].children).toHaveLength(2)

        expect(competencyWrapper.children[1].children[0]).toHaveTextContent('CA (2)')
        expect(competencyWrapper.children[1].children[1]).toHaveTextContent('CB (1)')

        await act(() => {
            fireEvent.click(competencyWrapper.children[1].children[0].firstChild)

            return Promise.resolve();
        })

        await act(() => {
            fireEvent.click(competencyWrapper.children[1].children[1].firstChild)

            return Promise.resolve();
        })

        expect(competencyWrapper.children[1].children[0]).toHaveTextContent('CQ1')
        expect(competencyWrapper.children[1].children[0]).toHaveTextContent('CQ2')
        expect(competencyWrapper.children[1].children[1]).toHaveTextContent('CQ3')

        expect(onDelete).toHaveBeenCalledTimes(1)
    })
})