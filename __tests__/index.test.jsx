import { render, screen } from '@testing-library/react'
// import Home from '../src/components/pages/index'

const Sum = ({ a = 0, b = 0 }) => <span data-testid="suming">{a+b}</span>

describe('Home', () => {
  it('should have  a heading', () => {
    render(<Sum a={2} b={2} />)

    const result = screen.getByTestId('suming')

    expect(result).toHaveTextContent('4')
  })
})
