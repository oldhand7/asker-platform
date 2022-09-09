import { render } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { useForm } from './index';
import { useFieldArray } from 'react-hook-form';

describe('react-hook-form', () => {
    it('should not report twice', () => {
        const JustSomeForm = ({ values, onValues }) => {
            const {
                watch,
                setValue,
                control
            } = useForm({
                values
            })

            const [formValues, setFormValues] = useState(watch())

            const { fields: items, update: updateItem } = useFieldArray({
                control,
                name: 'items',
                keyName: '_id'
            })

            useEffect(() => watch(setFormValues), [watch])

            useEffect(() => {
                onValues && onValues(formValues)
            }, [formValues, onValues])

            useEffect(() => {
                updateItem(0, { name: 'xxx' })
            }, [])

            return <div>nothing here...{values.abc}</div>
        }

        const onValues = jest.fn();

        const {
            debug
        } = render(<JustSomeForm values={{ abc: 123, items: [{ name: 'aaa'}] }} onValues={onValues} />)
        
        expect(onValues).toHaveBeenCalledTimes(2)

        expect(onValues.mock.calls[0][0].abc).toEqual(123)

        expect(onValues.mock.calls[0][0].items[0].name).toEqual('aaa')
        expect(onValues.mock.calls[1][0].items[0].name).toEqual('xxx')
    })
})