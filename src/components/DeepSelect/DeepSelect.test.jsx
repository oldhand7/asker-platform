import { fireEvent, getAllByRole, queryByRole, render, within } from "@testing-library/react";
import DeepSelect from './DeepSelect';

describe('DeepSelect', () => {
    it('should display work without initial props', () => {
        const {
            getByText,
            container
        }  = render(<DeepSelect />)

        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        const trigger = getByText('Choose')

        fireEvent.click(trigger)

        expect(container.firstChild).toHaveAttribute('data-status', 'open')

        expect(container).toHaveTextContent('No templates')
    })

    it('should allow for an easy selection of options', () => {
        const options = [
            { id: 'aaa', name: 'AAA' },
            { id: 'bbb', name: 'BBB' },
            { id: 'ccc', name: 'CCC' }
        ]

        const onChange = jest.fn();

        const {
            getByText,
            getByRole,
            container
        }  = render(<DeepSelect placeholder='Choose your option' options={options} onChange={onChange} />)

        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        const trigger = getByText('Choose your option')

        fireEvent.click(trigger)

        expect(container.firstChild).toHaveAttribute('data-status', 'open')

        const { getAllByRole: getAllByRoleWithinList } = within(getByRole('list'))
        
        const items = getAllByRoleWithinList('listitem')

        expect(items.length).toEqual(3)

        expect(items[0]).toHaveTextContent('AAA')
        expect(items[1]).toHaveTextContent('BBB')
        expect(items[2]).toHaveTextContent('CCC')

        fireEvent.click(items[0])

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].id).toEqual('aaa')
    })

    it('should allow for an easy of actions wihtin options', () => {
        const options = [
            { id: 'o1', name: 'Option 1' },
            { id: 'o2', name: 'Option 2' }
        ]

        const actions = [
            { id: 'delete', name: 'Delete' }
        ]

        const onAction = jest.fn();

        const {
            getByText,
            getAllByRole,
            container
        }  = render(<DeepSelect option={options[0]} options={options} actions={actions} onAction={onAction} />)

        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        const trigger = getByText('Option 1')

        fireEvent.click(trigger)

        expect(container.firstChild).toHaveAttribute('data-status', 'open')

        const menu = container.querySelector('ul')

        const { getAllByRole: getAllByRoleWithinList } = within(getAllByRole('list')[0])
        
        const items = getAllByRoleWithinList('listitem')

        expect(menu.children.length).toEqual(2)
        expect(menu.children[1]).toHaveTextContent('Option 2')

        const {
            getByRole: getByRoleWithinMenuItem,
            getAllByRole: getAllByRoleWithinItem
        } = within(menu.children[1])

        fireEvent.click(getByRoleWithinMenuItem('button'))

        const menuItemActionItems = menu.children[1].querySelectorAll('li')

        expect(menuItemActionItems.length).toEqual(1)
        expect(menuItemActionItems[0]).toHaveTextContent('Delete')

        fireEvent.click(menuItemActionItems[0])

        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        expect(onAction).toHaveBeenCalledTimes(1);

        expect(onAction.mock.calls[0][0].id).toEqual('delete')
        expect(onAction.mock.calls[0][1].id).toEqual('o2')
    })
})