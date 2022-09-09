import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import TinyInputForm from './tiny-input-form';

describe('tiny-input-form', () => {
    it('should provide an interface for editing a text', async () => {
        const onValues = jest.fn()

        const {
            getByRole,
            getByPlaceholderText,
            container
        } = render(<TinyInputForm values={{ value: "foo123" }} requiredMessage="This is a must!" onValues={onValues} placeholder='Code' buttonLabel='OK' />);

        const input = getByPlaceholderText("Code")

        expect(input).toHaveValue("foo123")

        fireEvent.focus(input)

        userEvent.type(input, '{selectall}{backspace}{backspace}{enter}')

        expect(container).toHaveTextContent('This is a must!')

        fireEvent.focus(input)

        userEvent.type(input, 'abc123{enter}')
        userEvent.type(input, '4')

        const button = getByRole('button', { name: 'OK' })

        fireEvent.click(button)

        expect(onValues).toHaveBeenCalledTimes(2)
        
        expect(onValues.mock.calls[0][0].value).toEqual('abc123')
        expect(onValues.mock.calls[1][0].value).toEqual('abc1234')
    })
})