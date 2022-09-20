import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LazyInput from './LazyInput'

describe('LazyInput', () => {
    it('should have label transformed into input', () => {
        const {
            queryByPlaceholderText,
            getByText,
            debug
        } = render(<LazyInput label="Enter your birthyear" placeholder="Year" value="2005" />)

        const label = getByText("Enter your birthyear")

        const inputBefore = queryByPlaceholderText('Year')

        expect(inputBefore).toBeNull()
        
        fireEvent.click(label)

        const inputAfter = queryByPlaceholderText('Year')

        expect(inputAfter).toHaveValue("2005")

    })

    it('should report value if no error', () => {
        const validate = jest.fn((value) => {
            return !value ? "bad bad very bad!" : '';
        })

        const onChange = jest.fn()

        const {
            queryByPlaceholderText,
            getByText,
            container
        } = render(<LazyInput label="Enter your birthyear" onChange={onChange} validate={validate} placeholder="Year" value="2005" />)

        const label = getByText("Enter your birthyear")

        fireEvent.click(label)

        const input = queryByPlaceholderText('Year')

        expect(input).toHaveValue('2005')

        userEvent.type(input, '{selectall}{backspace}{enter}')
        
        expect(container).toHaveTextContent('bad bad very bad!')

        userEvent.type(input, '2000{enter}')

        userEvent.type(input, '2000')

        expect(input).toHaveValue('2000')

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange.mock.calls[0][0]).toEqual('2000')

        expect(validate).toHaveBeenCalled()
    })

    it('should cancel value entered if escaped or clicked outside component', () => {
        const {
            queryByPlaceholderText,
            getByRole,
            getByText
        } = render(<div>
            <button>Click me!</button>
            <LazyInput label="Enter your birthyear"  placeholder="Year" value="2005" />
        </div>)
        
        const label1 = getByText("Enter your birthyear")

        fireEvent.click(label1)

        const input1 = queryByPlaceholderText('Year')

        expect(input1).toHaveValue("2005")

        userEvent.type(input1, "2006{escape}")

        const input2 = queryByPlaceholderText('Year')
    
        expect(input2).toBeNull()

        const label2 = getByText("Enter your birthyear")

        fireEvent.click(label2)

        const input3 = queryByPlaceholderText('Year')

        expect(input3).toHaveValue("2005")

        const button = getByRole('button', { name: 'Click me!' })

        fireEvent.click(button)

        const input4 = queryByPlaceholderText('Year')

        expect(input4).toBeNull()
    })
})