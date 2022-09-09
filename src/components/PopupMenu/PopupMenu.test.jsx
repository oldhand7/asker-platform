import { fireEvent, render, within } from "@testing-library/react";
import PopupMenu from "./PopupMenu";

describe('PopupMenu', () => {
    it('should allow for selection of option', () => {
        const menuItems = [
            { id: 'a', name: 'Item A'},
            { id: 'b', name: 'Item B'},
            { id: 'c', name: 'Item C'}
        ]

        const onChange = jest.fn();

        const {
            getByText,
            getByRole,
            container
        } = render(<PopupMenu className={'testclass'} items={menuItems} onChange={onChange}>Open menu</PopupMenu>);

        expect(container.firstChild.classList.contains('testclass'))
        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        const trigger = getByText('Open menu')

        fireEvent.click(trigger)

        expect(container.firstChild).toHaveAttribute('data-status', 'open')

        const menu = getByRole('list')

        const { getAllByRole: getAllByRoleWithinMenu } = within(menu)

        const items = getAllByRoleWithinMenu('listitem')

        expect(items[0]).toHaveTextContent('Item A')
        expect(items[1]).toHaveTextContent('Item B')
        expect(items[2]).toHaveTextContent('Item C')

        fireEvent.click(items[0])

        expect(container.firstChild).toHaveAttribute('data-status', 'closed')

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange.mock.calls[0][0].id).toEqual('a')
    })
})