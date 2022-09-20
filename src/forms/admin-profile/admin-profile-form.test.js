import { fireEvent, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminProfileForm from './admin-profile-form';
import { withModal } from 'libs/modal';
import { act } from 'react-dom/test-utils';

describe('admin-profile-form', () => {
    
    it('should allow for a contact information change', async () => {
        const userApi = {
            user: {
                name: 'Joe Philips',
                email: 'joe.philips@example.com',
                phone: ''
            },
            getAvatar: () => 'https://placekitten.com/200/300',
            updateProfile: jest.fn()
        }

        window.scrollTo  = jest.fn()

        const AdminProfileFormWithModal = withModal(AdminProfileForm);

        const {
            debug,
            container,
            getByPlaceholderText,
            getByTestId,
            getByRole
        } = render(<AdminProfileFormWithModal userApi={userApi} />);

        expect(getByTestId('avatar').firstChild).toHaveAttribute('src', 'https://placekitten.com/200/300')

        const nameInput = getByPlaceholderText('Name')

        expect(nameInput).toHaveValue('Joe Philips')

        const phoneInput = getByPlaceholderText('Phone')

        expect(phoneInput).toHaveValue('')

        userEvent.type(phoneInput, '+37061112223')

        const submitButton = getByRole('button', { name: 'Save' })

        await act(() => {
            fireEvent.click(submitButton)

            return Promise.resolve()
        })

        expect(userApi.updateProfile).toHaveBeenCalledTimes(1)

        expect(userApi.updateProfile.mock.calls[0][0].phone).toEqual('+37061112223')
    })

    it('should ask for password if email is being changed', async () => {
        const userApi = {
            user: {
                name: 'Joe Philips',
                email: 'joe.philips@example.com',
                phone: ''
            },
            getAvatar: () => 'https://placekitten.com/200/300',
            updateProfile: jest.fn(),
            changeEmail: jest.fn()
        }

        window.scrollTo  = jest.fn()

        const AdminProfileFormWithModal = withModal(AdminProfileForm);

        const {
            debug,
            container,
            getByPlaceholderText,
            getByRole,
            baseElement
        } = render(<AdminProfileFormWithModal userApi={userApi} />);

        const emailInput = getByPlaceholderText('Email')

        expect(emailInput).toHaveValue('joe.philips@example.com')

        userEvent.type(emailInput, '{selectall}joe.philips@yahoo.com')

        const submitButton = getByRole('button', { name: 'Save' })

        await act(() => {
            fireEvent.click(submitButton)

            return Promise.resolve()
        })

        expect(baseElement.classList.contains('modal')).toBeTruthy();

        const modal = baseElement.querySelector('#password-modal')

        const {
            getByPlaceholderText: getByPlaceholderTextWithinModal,
            getByRole: getByRoleWithinModal
        } = within(modal)

        const passwordInput = getByPlaceholderTextWithinModal('Password')

        userEvent.type(passwordInput, 'test123')

        const submitButtonWithinModal = getByRoleWithinModal('button', { name: 'Submit'})

        await act(() => {
            fireEvent.click(submitButtonWithinModal)

            return Promise.resolve()
        })

        expect(baseElement.classList.contains('modal')).toBeFalsy();

        expect(userApi.changeEmail).toHaveBeenCalledTimes(1)
        
        expect(userApi.changeEmail.mock.calls[0][0]).toEqual('joe.philips@yahoo.com')
        expect(userApi.changeEmail.mock.calls[0][1]).toEqual('test123')

        expect(userApi.updateProfile).toHaveBeenCalledTimes(1)

        expect(userApi.updateProfile.mock.calls[0][0].email).toEqual('joe.philips@yahoo.com')
    })

    it('should allow for password change with new password confirmed and old password requested just before submition', async () => {
        const userApi = {
            user: {
                name: 'Joe Philips',
                email: 'joe.philips@example.com',
                phone: ''
            },
            getAvatar: () => 'https://placekitten.com/200/300',
            updateProfile: jest.fn(),
            changeEmail: jest.fn(),
            changePassword: jest.fn()
        }

        window.scrollTo  = jest.fn()

        const AdminProfileFormWithModal = withModal(AdminProfileForm);

        const {
            debug,
            container,
            getByPlaceholderText,
            getByLabelText,
            getByText,
            getByRole,
            baseElement
        } = render(<AdminProfileFormWithModal userApi={userApi} />);

        const changePasswordLink = getByText('Change password')

        await act(() => {
            fireEvent.click(changePasswordLink)

            return Promise.resolve()
        })

        const newPasswordInput = getByLabelText('New password');

        userEvent.type(newPasswordInput, 'test1234')

        const newPasswordConfirmInput = getByLabelText('New password (confirm)');

        userEvent.type(newPasswordConfirmInput, 'test1234')

        const submitButton = getByRole('button', { name: 'Save' })

        await act(() => {
            fireEvent.click(submitButton)

            return Promise.resolve()
        })

        expect(baseElement.classList.contains('modal')).toBeTruthy();

        const modal = baseElement.querySelector('#password-modal')

        const {
            getByPlaceholderText: getByPlaceholderTextWithinModal,
            getByRole: getByRoleWithinModal
        } = within(modal)

        const passwordInput = getByPlaceholderTextWithinModal('Password')

        userEvent.type(passwordInput, 'test123')

        const submitButtonWithinModal = getByRoleWithinModal('button', { name: 'Submit'})

        await act(() => {
            fireEvent.click(submitButtonWithinModal)

            return Promise.resolve()
        })

        expect(baseElement.classList.contains('modal')).toBeFalsy();

        expect(userApi.changePassword).toHaveBeenCalledTimes(1)
        
        expect(userApi.changePassword.mock.calls[0][0]).toEqual('test1234')
        expect(userApi.changePassword.mock.calls[0][1]).toEqual('test123')

        expect(userApi.updateProfile).toHaveBeenCalledTimes(1)
    })
})

