import { render, screen, fireEvent } from '@testing-library/react'
import QuestionScoreBoard from './QuestionScoreBoard'
import { calcScore, createDummyVotes } from 'libs/helper';

const rules = [
  {
    name: 'Step 1',
    steps: [
      'S1A', 'S1B', 'S1C'
    ]
  },
  {
    name: 'Step 2',
    steps: [
      'S2A', 'S2B', 'S2C'
    ]
  },
  {
    name: 'Step 3',
    steps: [
      'S3A', 'S3B', 'S3C'
    ]
  }
]

describe('QuestionScoreBoard', () => {
  it('should automaticly assign a head', () => {
    let votes = createDummyVotes(rules);

    const { rerender } = render(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)

    expect(screen.queryByTestId('question-score-board-active')).not.toBeInTheDocument()
    screen.getByText('S3C').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[1].head).toBeFalsy();
    expect(votes[2].head).toEqual(1);

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.getByTestId('question-score-board-active')).toHaveTextContent('Step 3')
    screen.getByText('S3C').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[1].head).toBeFalsy();
    expect(votes[2].head).toBeFalsy();

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.queryByTestId('question-score-board-active')).not.toBeInTheDocument()
    screen.getByText('S1A').click()

    expect(votes[0].head).toEqual(1);
    expect(votes[1].head).toBeFalsy();
    expect(votes[2].head).toBeFalsy();

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.getByTestId('question-score-board-active')).toHaveTextContent('Step 1')
    screen.getByText('S3C').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[1].head).toEqual(1);
    expect(votes[2].head).toBeFalsy();

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.getByTestId('question-score-board-active')).toHaveTextContent('Step 2')
    screen.getByText('S2B').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[0].tail[0]).toBeTruthy();
    expect(votes[0].tail[1]).toBeFalsy();
    expect(votes[0].tail[2]).toBeFalsy();

    expect(votes[1].head).toEqual(1);
    expect(votes[1].tail[0]).toBeFalsy();
    expect(votes[1].tail[1]).toBeTruthy();
    expect(votes[1].tail[2]).toBeFalsy();

    expect(votes[2].head).toBeFalsy();
    expect(votes[2].tail[0]).toBeFalsy();
    expect(votes[2].tail[1]).toBeFalsy();
    expect(votes[2].tail[2]).toBeTruthy();

    expect(calcScore(votes)).toEqual(2)
  })

  it('should stick to users decision', () => {
    let votes = createDummyVotes(rules);

    const { rerender } = render(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)

    expect(screen.queryByTestId('question-score-board-active')).not.toBeInTheDocument()
    screen.getByText('S3A').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[1].head).toBeFalsy();
    expect(votes[2].head).toEqual(1);

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.getByTestId('question-score-board-active')).toHaveTextContent('Step 3')
    screen.getByText('Step 2').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[1].head).toEqual(true);
    expect(votes[2].head).toBeFalsy();

    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    expect(screen.getByTestId('question-score-board-active')).toHaveTextContent('Step 2')

    screen.getByText('S3A').click()
    rerender(<QuestionScoreBoard rules={rules} votes={votes} onVotes={v => votes = v} />)
    screen.getByText('S1A').click()

    expect(votes[0].head).toBeFalsy();
    expect(votes[0].tail[0]).toBeTruthy();
    expect(votes[0].tail[1]).toBeFalsy();
    expect(votes[0].tail[2]).toBeFalsy();

    expect(votes[1].head).toEqual(true);
    expect(votes[1].tail[0]).toBeFalsy();
    expect(votes[1].tail[1]).toBeFalsy();
    expect(votes[1].tail[2]).toBeFalsy();

    expect(votes[2].head).toBeFalsy();
    expect(votes[2].tail[0]).toBeFalsy();
    expect(votes[2].tail[1]).toBeFalsy();
    expect(votes[2].tail[2]).toBeFalsy();

    expect(calcScore(votes)).toEqual(2)
  })
})
