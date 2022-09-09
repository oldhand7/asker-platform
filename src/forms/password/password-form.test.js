import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import PasswordForm from './password-form';

describe('password-form', () => {
    it('should return password entered', async () => {
        const onValues = jest.fn()

        const {
            getByRole,
            getByPlaceholderText,
            getByLabelText,
            container,
            debug
        } = render(<PasswordForm onValues={onValues} min={12} />)

        const input = getByPlaceholderText('Password');
        const button = getByRole('button', { name: 'Submit' })
        
        await act(() => {
            fireEvent.click(button)

            return Promise.resolve()
        })

        expect(container).toHaveTextContent('Field required.');

        userEvent.type(input, 'x')

        expect(container).toHaveTextContent('Minimum 12 characters.');

        userEvent.type(input, 'yyyzzz88811')

        await act(() => {
            fireEvent.click(button)

            return Promise.resolve()
        })

        expect(onValues).toHaveBeenCalledTimes(1)
        expect(onValues.mock.calls[0][0]).toEqual('xyyyzzz88811')
    })
})