import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextInput from "./TextInput";

describe('TextInput', () => {
    it('should allow have props applied', () => {
        const {
            getByPlaceholderText
        } = render(<TextInput placeholder="XXX" defaultValue="YYY" id="ZZZ" />)

        const input = getByPlaceholderText('XXX')

        expect(input).toHaveValue('YYY')
        expect(input).toHaveAttribute('id', 'ZZZ')
    })

    it('should allow for text input', () => {
        const onChange = jest.fn();

        const {
            getByPlaceholderText
        } = render(<TextInput placeholder="Name" onChange={onChange} />)

        const input = getByPlaceholderText('Name')

        userEvent.type(input, 'John Nikolai')

        expect(input).toHaveValue('John Nikolai')

        expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].target.value).toEqual('John Nikolai')
    })

    it('should receive enter and escape keys', () => {
        const onEscape = jest.fn();
        const onEnter = jest.fn();

        const {
            getByPlaceholderText
        } = render(<TextInput placeholder="Name" onEscape={onEscape} onEnter={onEnter} />)

        const input = getByPlaceholderText('Name')

        fireEvent.focus(input)

        userEvent.type(input, '{enter}{enter}{escape}{escape}{escape}')

        expect(onEnter).toHaveBeenCalledTimes(2)
        expect(onEscape).toHaveBeenCalledTimes(3)
    })
})