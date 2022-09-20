const { fireEvent, render } = require("@testing-library/react")
const { default: userEvent } = require("@testing-library/user-event")
import SummaryStageForm from './summary-stage-form'

describe('summary-stage-form', () => {
    it('should allow for stage text and time edit', () => {
        const onValues = jest.fn()
        const onError = jest.fn()

        const {
            getByPlaceholderText,
            container,
            getByText
        } = render(<SummaryStageForm test={1} onError={onError} values={{ html: 'Some text!', time: 12 }} onValues={onValues} />)

        expect(container).toHaveTextContent('Summary')
        expect(container).toHaveTextContent('12m')

        const label = getByText('12m')

        fireEvent.click(label)

        const timeInput = getByPlaceholderText('Min')

        userEvent.type(timeInput, '{selectall}{backspace}15{enter}')

        const input = getByPlaceholderText('Enter your summary text')

        userEvent.type(input, '{selectall}{backspace}Some better text!{enter}')

        expect(onError).toHaveBeenCalledTimes(3)
        expect(onError.mock.calls[1][0].message).toEqual('Form invalid.')
        expect(onError.mock.calls.length).toBeLessThan(100)

        const result = onValues.mock.calls[onValues.mock.calls.length - 1][0];

        expect(result.html).toContain('Some better text!')
        expect(result.time).toEqual('15')
    })
})