import { fireEvent, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils';
import StageTreeLeaf from './StageTreeLeaf';

describe('StageTreeLeaf', () => {

    it('should render label and time if provided and respond to actions', async () => {
        const onClick = jest.fn();
        const onAction = jest.fn();

        const actions = [
            { id: 'delete', name: 'Delete' }
        ]

        const {
            container,
            getByRole,
            getAllByRole
        } = render(<StageTreeLeaf className='testclass' label='Apples' time='12' actions={actions} onClick={onClick} onAction={onAction} />);

        expect(container.firstChild.classList.contains('testclass')).toBe(true);

        expect(container).toHaveTextContent('Apples')
        expect(container).toHaveTextContent('12m')

        await act(() => {
            fireEvent.click(container.firstChild)
            fireEvent.click(container.firstChild)
            fireEvent.click(container.firstChild)

            return Promise.resolve()
        })

        const buttonPopupMenu = getByRole('button')

        await act(() => {
            fireEvent.click(buttonPopupMenu)

            return Promise.resolve()
        })

        const optionsPopupMenu = getAllByRole('listitem')

        expect(optionsPopupMenu[0]).toHaveTextContent('Delete')

        await act(() => {
            fireEvent.click(optionsPopupMenu[0]);

            return Promise.resolve()
        })

        expect(onClick).toHaveBeenCalledTimes(3)

        expect(onAction).toHaveBeenCalledTimes(1)
        expect(onAction.mock.calls[0][0].id).toEqual('delete')
    })
})