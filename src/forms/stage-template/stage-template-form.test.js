import { fireEvent, getByRole, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StageTemplateForm from './stage-template-form';
import {act} from 'react-dom/test-utils';
import { UserContext } from 'libs/user';

const user = {
    id: 'u1',
    name: 'User 1'
}

describe('stage-template-form', () => {
    it('should allow for saving of configurations', async () => {
        const documentsApi = {
            filterManyDocuments: jest.fn(() => Promise.resolve([])),
            saveCollectionDocument: jest.fn(() => Promise.resolve({ id: 'z1' })),
            deleteSingle: jest.fn()
        }

        const {
            debug,
            getByRole,
            getByPlaceholderText
        } = render(<UserContext.Provider value={{ user }}>
            <StageTemplateForm type='introduction' values={'xxxyyyzzz'} documentsApi={documentsApi} />
            </UserContext.Provider>)

        const button = getByRole('button', { name: 'Save as template'})

        await act(() => {
            fireEvent.click(button);

            return Promise.resolve()
        })

        const input = getByPlaceholderText('Name')

        userEvent.type(input, 'Some template')

        const buttonSave = getByRole('button', { name: 'Save'})

        await act(() => {
            fireEvent.click(buttonSave)

            return Promise.resolve()
        })

        expect(documentsApi.filterManyDocuments).toHaveBeenCalledTimes(1)
        expect(documentsApi.saveCollectionDocument).toHaveBeenCalledTimes(1)
        expect(documentsApi.deleteSingle).toHaveBeenCalledTimes(0)
        expect(documentsApi.saveCollectionDocument.mock.calls[0][0]).toEqual('configTemplates')
        expect(documentsApi.saveCollectionDocument.mock.calls[0][1].name).toEqual('Some template')
        expect(documentsApi.saveCollectionDocument.mock.calls[0][1].type).toEqual('introduction')
        expect(documentsApi.saveCollectionDocument.mock.calls[0][1].values).toEqual('xxxyyyzzz')
    })

    it('should allow selecting existing configurations', async () => {
        const documentsApi = {
            filterManyDocuments: jest.fn(() => Promise.resolve([
                { id: 't1', name: 'T1', values: 'T1value' }
            ])),
            saveCollectionDocument: jest.fn(() => Promise.resolve({ id: 'z1' })),
            deleteSingle: jest.fn()
        }

        const onValues = jest.fn();

        const {
            getByText,
            getByPlaceholderText
        } = render(<UserContext.Provider value={{ user }}>
            <StageTemplateForm type='summary' documentsApi={documentsApi} onValues={onValues} />
            </UserContext.Provider>)

        const labelTrigger = getByText('Choose')

        await act(() => {
            fireEvent.click(labelTrigger);

            return Promise.resolve()
        })

        const templateOption = getByText('T1')

        await act(() => {
            fireEvent.click(templateOption);

            return Promise.resolve()
        })

        const input = getByPlaceholderText('Name')

        expect(input).toHaveValue('T1')

        expect(documentsApi.filterManyDocuments).toHaveBeenCalledTimes(1)
        expect(documentsApi.saveCollectionDocument).toHaveBeenCalledTimes(0)
        expect(documentsApi.deleteSingle).toHaveBeenCalledTimes(0)

        expect(onValues).toHaveBeenCalledTimes(1)
        expect(onValues.mock.calls[0][0]).toEqual('T1value')
    })

    it('should allow deleting of configurations', async () => {
        const documentsApi = {
            filterManyDocuments: jest.fn(() => Promise.resolve([
                { id: 'x1', name: 'X1', values: 'X1value' }
            ])),
            saveCollectionDocument: jest.fn(() => Promise.resolve({ id: 'z1' })),
            deleteSingle: jest.fn()
        }

        const actions = [
            { id: 'delete', name: 'Delete' }
        ]

        const {
            getByText,
            debug
        } = render(<UserContext.Provider value={{ user }}>
            <StageTemplateForm type='summary' documentsApi={documentsApi} actions={actions} />
        </UserContext.Provider>)

        const labelTrigger = getByText('Choose')

        await act(() => {
            fireEvent.click(labelTrigger);

            return Promise.resolve()
        })

        const templateOption = getByText('X1').closest('li')

        const {
            getByRole: getByRoleWithinOption,
            getByText: getByTextWithinOption
        } = within(templateOption)

        await act(() => {
            fireEvent.click(getByRoleWithinOption('button'))
            fireEvent.click(getByTextWithinOption('Delete').closest('li'))

            return Promise.resolve()
        })

        expect(documentsApi.filterManyDocuments).toHaveBeenCalledTimes(2)
        expect(documentsApi.saveCollectionDocument).toHaveBeenCalledTimes(0)
        expect(documentsApi.deleteSingle).toHaveBeenCalledTimes(1)

        expect(documentsApi.deleteSingle.mock.calls[0][0]).toEqual('configTemplates');
        expect(documentsApi.deleteSingle.mock.calls[0][1]).toEqual('x1');
    })
})