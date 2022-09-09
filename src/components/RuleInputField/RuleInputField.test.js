import { render, fireEvent, within, findByRole, getByTitle, getByPlaceholderText} from '@testing-library/react';
import RuleInputField from './RuleInputField'
import userEvent from '@testing-library/user-event';

const pause = (s) => {
    return new Promise((resolve, reject) => {
     setTimeout(resolve, s * 1000)
    });
 }

describe('RuleInputField', () => {
    it('should allow editing of competeny rule', async () => {
        const rule = {
            name: {
                en: 'Advanced'
            },
            steps: [
                { en: 'Just some step 1' },
                { en: 'Just some step 2' },
                { en: 'Just some step 3' }
            ]
        }

        document.execCommand = jest.fn()
        document.queryCommandState = jest.fn()

        const onChange = jest.fn();

        const { 
            getByRole,
            getByPlaceholderText,
            getByText,
            container
        } = render(<RuleInputField className="testclass" index={123} rule={rule} onChange={onChange} />)

        expect(container.firstChild.classList.contains('testclass')).toBe(true)

        const list = getByRole('list')

        const { getAllByRole } = within(list)

        const items = getAllByRole("listitem")

        expect(items.length).toBe(4)

        expect(items[0]).toHaveTextContent('124')
        expect(items[0]).toHaveTextContent('Advanced')
        expect(items[1]).toHaveTextContent('Just some step 1')
        expect(items[2]).toHaveTextContent('Just some step 2')
        expect(items[3]).toHaveTextContent('Just some step 3')

        fireEvent.click(getByTitle(getAllByRole("listitem")[0], 'Edit name'))

        const input = getByPlaceholderText('Name')

        expect(input).toHaveValue('Advanced')
    
        userEvent.type(input, '{selectall}Propro{esc}')

        expect(items[0]).toHaveTextContent('Advanced')

        fireEvent.click(getByTitle(items[0], 'Edit name'))

        const input2 = getByPlaceholderText('Name')

        expect(input2).toHaveValue('Advanced')

        userEvent.type(input2, '{selectall}Professional{enter}')

        expect(items[0]).toHaveTextContent('Professional')

        const htmlInput = getByText('Just some step 3')

        userEvent.type(htmlInput, 'x')

        expect(onChange).toBeCalledTimes(3);

        const rulesAfter = onChange.mock.calls[onChange.mock.calls.length - 1][0]

        expect(rulesAfter.name.en).toEqual('Professional')

        expect(rulesAfter.steps[0].en).toEqual('Just some step 1')
        expect(rulesAfter.steps[1].en).toEqual('Just some step 2')
        expect(rulesAfter.steps[2].en).toEqual('Just some step 3x')
    })
})