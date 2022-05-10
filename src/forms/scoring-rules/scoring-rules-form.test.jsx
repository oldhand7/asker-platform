import { render, screen, fireEvent, prettyDOM } from '@testing-library/react';

import ScoringRulesForm from './scoring-rules-form';

const dummyCriterias = [
  { name: 'AAA', weight: 50, id: 'aaa' },
  { name: 'BBB', weight: 25, id: 'bbb' },
  { name: 'CCC', weight: 20, id: 'ccc', },
  { name: 'DDD', weight: 5, id: 'ddd' }
]

describe('Scoring rules form', () => {
  it('should allow changing of score values', () => {
    let values = {};

    const { container } = render(<ScoringRulesForm
      values={null} criteria={dummyCriterias} onValues={v => values = v} />)

    const inputs = screen.getAllByPlaceholderText('%')

    fireEvent.change(inputs[0], {
       target: {
         value: 40
       }
     });

     fireEvent.change(inputs[1], {
        target: {
          value: 30
        }
      });

    fireEvent.change(inputs[2], {
       target: {
         value: 25
       }
     });

    screen.getByText('Save').click()

    expect(values['aaa'] == 40).toBeTruthy()
    expect(values['bbb'] == 30).toBeTruthy()
    expect(values['ccc'] == 25).toBeTruthy()
    expect(values['ddd'] == 5).toBeTruthy()
  })


  it('should not allow submition if sum of scores does not make 100%', () => {
    let values = {};

    render(<ScoringRulesForm
      values={null} criteria={dummyCriterias} onValues={v => values = v} />)

    screen.getByText('Your total must equal 100%')

    const inputs = screen.getAllByPlaceholderText('%')

    fireEvent.change(inputs[0], {
       target: {
         value: 55
       }
     });

    screen.getByText('Save').click()

    screen.getByText('Your total does not equal 100%')
  })
})
