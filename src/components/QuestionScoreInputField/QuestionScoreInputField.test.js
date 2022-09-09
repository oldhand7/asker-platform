import { render, within, fireEvent } from '@testing-library/react';
import QuestionScoreInputField from './QuestionScoreInputField';
import { createRule } from 'components/RuleInputField/RuleInputField';
import userEvent from '@testing-library/user-event'

describe('QuestionScoreInputField', () => {
    it('should rules ready for edit', () => {

        const rules = [
            createRule('XXX', 1),
            createRule('YYY', 2),
            createRule('ZZZ', 3)
        ]

        const onChange = jest.fn();

        const {
            container,
            debug
        } = render(<QuestionScoreInputField className="testclass" rules={rules} onChange={onChange} />)

        expect(container.firstChild.classList.contains('testclass')).toBe(true)

        expect(container).toHaveTextContent('Score')

        const list = container.querySelector('ul')

        const items = list.children

        expect(items.length).toBe(3)

        expect(items[0]).toHaveTextContent('1')
        expect(items[0]).toHaveTextContent('XXX')
        expect(items[0].querySelectorAll('li').length).toBe(1+1)

        expect(items[1]).toHaveTextContent('2')
        expect(items[1]).toHaveTextContent('YYY')
        expect(items[1].querySelectorAll('li').length).toBe(2+1)

        expect(items[2]).toHaveTextContent('3')
        expect(items[2]).toHaveTextContent('ZZZ')
        expect(items[2].querySelectorAll('li').length).toBe(3+1)
        
        const { getAllByPlaceholderText } = within(items[2])

        const htmlInputs = getAllByPlaceholderText('Write here')

        userEvent.type(htmlInputs[2], 'foo')

        const { getByTitle, getByPlaceholderText } = within(items[0])

        fireEvent.click(getByTitle('Edit name'))

        const input = getByPlaceholderText('Name')

        userEvent.type(input, 'x')

        expect(input).toHaveValue('XXXx')

        userEvent.type(input, '{enter}')

        expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(1)
        expect(onChange.mock.calls.length).toBeLessThan(10)

        const result = onChange.mock.calls[onChange.mock.calls.length - 1][0]

        expect(result[0].name.en).toEqual('XXXx')
        expect(result[2].steps[2].en).toEqual('foo')
    })
})