import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MinutesInput from './MinutesInput'

describe('MinutesInput', () => {

    it('should report value if no error', () => {
    
        const onChange = jest.fn()

        const {
            queryByPlaceholderText,
            getByText,
            container
        } = render(<MinutesInput minutes="20" onChange={onChange} />)

        expect(container).toHaveTextContent('20m')

        const label = getByText("20m")

        fireEvent.click(label)

        const input = queryByPlaceholderText('Min')

        expect(input).toHaveValue('20')

        userEvent.type(input, '{selectall}{backspace}22')
        
        expect(input).toHaveValue('22')

        userEvent.type(input, '{enter}')

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange.mock.calls[0][0]).toEqual('22')
    })
})