import { render } from '@testing-library/react';
import TimeLabel from './TimeLabel';

describe('TimeLabel', () => {
    it('should render labeled time', () => {
        const {
            container: { firstChild: root }
        } = render(<TimeLabel className={'testclass'} time={99} />)

        expect(root.classList.contains('testclass')).toBe(true);
        
        expect(root).toHaveTextContent('Total time:')
        expect(root).toHaveTextContent('1h 39m')
    })

    it('should render labeled time with custom label', () => {
        const {
            container: { firstChild: root }
        } = render(<TimeLabel label='Time remainin:' className={'testclass'}>xxx</TimeLabel>)

        expect(root.classList.contains('testclass')).toBe(true);
        
        expect(root).toHaveTextContent('Time remainin:')
        expect(root).toHaveTextContent('xxx')
    })
})