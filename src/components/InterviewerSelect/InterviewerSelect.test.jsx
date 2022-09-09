import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DbContext } from 'libs/db';
import { UserContext } from 'libs/user';
import { act } from 'react-dom/test-utils';
import InterviewerSelect from './InterviewerSelect';

describe('InterviewerSelect', () => {
    
    it('should have default value set and allow change of interviewer', async () => {
        const users = [
            { id: 'u1', name: 'User 1' },
            { id: 'u2', name: 'User 2' },
            { id: 'u3', name: 'User 3' }
        ]

        const documentsApi = {
            filterMany: jest.fn(() =>  Promise.resolve(users)),
        }

        const onChange = jest.fn();

        const {
            container: { firstChild: root },
            getByText,
            getByRole
        } = render(<DbContext.Provider value={documentsApi}>
            <UserContext.Provider value={{ user: users[0] }}>
            <InterviewerSelect className='testclass' interviewer={users[0]} onChange={onChange} />
            </UserContext.Provider>
        </DbContext.Provider>)

        expect(root.classList.contains('testclass')).toBe(true)
        expect(root).toHaveTextContent('Select interviewer')

        const input = getByRole('combobox')

        await act(() => {
            userEvent.type(input, 'User 2')

            return Promise.resolve()
        })

        const user = getByText('User 2')

        await act(() => {
            fireEvent.click(user)

            return Promise.resolve()
        })

        expect(documentsApi.filterMany).toHaveBeenCalledTimes(1)
        expect(documentsApi.filterMany.mock.calls[0][0]).toEqual('users')
        
        expect(onChange).toHaveBeenCalledTimes(1)

        expect(onChange.mock.calls[0][0].id).toEqual('u2')
    })
})