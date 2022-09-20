import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimedTitle from './TimedTitle'

describe('TimedTitle', () => {

    it('should show a title together with time input', () => {
    
        const onChange = jest.fn()

        const {
            queryByPlaceholderText,
            getByText,
            container
        } = render(<TimedTitle time="30" onChange={onChange}>Foo Bar Baz</TimedTitle>)

        expect(container).toHaveTextContent('Foo Bar Baz')
        expect(container).toHaveTextContent('30m')

        const label = getByText("30m")

        fireEvent.click(label)

        const input = queryByPlaceholderText('Min')

        expect(input).toHaveValue('30')

        userEvent.type(input, '{selectall}{backspace}32')
        
        expect(input).toHaveValue('32')

        userEvent.type(input, '{enter}')

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange.mock.calls[0][0]).toEqual('32')
    })
})