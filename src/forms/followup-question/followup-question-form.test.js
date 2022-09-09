import { render, screen, getByText, getByRole, within, fireEvent } from '@testing-library/react'
import FollowupQuestionForm from './followup-question-form'
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('ProjectEvaluationCriteria', () => {
  it('should have a list of evaluations sorted by Z-A', async () => {

    let questions = [
      { en: 'Just some question 1', se: 'Just some questione 1' },
      { en: 'Just some question 2', se: 'Just some questione 2' },
      { en: 'Just some question 3', se: 'Just some questione 3' }
    ]

    const onValuesMock = jest.fn();

    const {
      getByRole: getByRoleWithin,
      container
    } = render(<FollowupQuestionForm className={"testclass"} values={questions} onValues={onValuesMock} />)

    expect(container.firstChild.classList.contains('testclass')).toBe(true)

    const list = screen.getByRole("list", {
      name: /Follow-up questions/i,
    })

    const { getAllByRole } = within(list)

    const items = getAllByRole("listitem")
  
    expect(items.length).toBe(3)

    expect(items[0]).toHaveTextContent('Just some question 1')
    expect(items[1]).toHaveTextContent('Just some question 2')
    expect(items[2]).toHaveTextContent('Just some question 3')

    fireEvent.click(getByRole(items[0], 'button'))

    const itemsAfterDelete = getAllByRole("listitem")

    expect(itemsAfterDelete.length).toBe(2)

    expect(itemsAfterDelete[0]).toHaveTextContent('Just some question 2')
    expect(itemsAfterDelete[1]).toHaveTextContent('Just some question 3')
    
    const button = getByRoleWithin('button', {name: 'Add new follow-up question'});
    
    fireEvent.click(button)

    const input = screen.queryByPlaceholderText('E.g. What was your responsibility?')

    userEvent.type(input, "Just some question x");

    expect(input).toHaveValue('Just some question x');

    await act(() => {
      userEvent.type(input, "{enter}");

      return Promise.resolve()
    })
    
    expect(onValuesMock).toHaveBeenCalledTimes(3)

    const questionsAfter = onValuesMock.mock.calls[2][0]

    expect(questionsAfter.length).toBe(3)

    expect(questionsAfter[0].en).toEqual('Just some question 2')
    expect(questionsAfter[1].en).toEqual('Just some question 3')
    expect(questionsAfter[2].en).toEqual('Just some question x')
  })
})
