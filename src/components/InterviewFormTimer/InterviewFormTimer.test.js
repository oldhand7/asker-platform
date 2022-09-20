import { fireEvent, getByRole, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import InterviewFormTimer from './InterviewFormTimer';

describe('InterviewFormTimer', () => {
    it('should track progress and time', () => {
        const {
            container: { firstChild: root }
        } = render(<InterviewFormTimer
            className='testclass'
            totalStages={10}
            completeStages={2}
        />)

        expect(root.classList.contains('testclass')).toBe(true);
        expect(root).toHaveTextContent('20%')
    })

    it('should count time', async () => {
        const {
            container: { firstChild: root },
            getByRole,
            findByText
        } = render(<InterviewFormTimer
            className='testclass'
            totalTime={80}
            availableTime={80}
        />)

        expect(root.classList.contains('testclass')).toBe(true);

        const buttonStart = getByRole('button', { name: 'Start timer (1h 20m)'})

        await act(() => {
            fireEvent.click(buttonStart)

            return Promise.resolve();
        })

        const buttonPause = await findByText('Pause timer (1h 19m 59s)')

        await act(() => {
            fireEvent.click(buttonPause)

            return Promise.resolve();
        })

        expect(root).toHaveTextContent('Continue timer (1h 19m 59s)')
    })
})