import { render } from '@testing-library/react';
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ProjectStageChoose from "./ProjectStageChoose";

describe('ProjectStageChoose', () => {
    it('should allow for selection of stages', async () => {
        const onChoose = jest.fn()

        const {
            getByText,
            container
        } = render(<ProjectStageChoose onChoose={onChoose} />)

        expect(container).toHaveTextContent('Add interview stage')

        const sections = [
            getByText('Structure').closest('div').querySelectorAll('li'),
            getByText('Evaluation').closest('div').querySelectorAll('li'),
            getByText('Attraction').closest('div').querySelectorAll('li')
        ]

        expect(sections[0]).toHaveLength(2)
        expect(sections[0][0]).toHaveTextContent('Introduction')
        expect(sections[0][1]).toHaveTextContent('Summary')

        expect(sections[1]).toHaveLength(6)
        expect(sections[1][0]).toHaveTextContent('Competency')
        expect(sections[1][1]).toHaveTextContent('Experience')
        expect(sections[1][2]).toHaveTextContent('Hard skill')
        expect(sections[1][3]).toHaveTextContent('Culture')
        expect(sections[1][4]).toHaveTextContent('Motivation')
        expect(sections[1][5]).toHaveTextContent('Screening')

        expect(sections[2]).toHaveLength(4)
        expect(sections[2][0]).toHaveTextContent('Company')
        expect(sections[2][1]).toHaveTextContent('Salary')
        expect(sections[2][2]).toHaveTextContent('Candidate')
        expect(sections[2][3]).toHaveTextContent('Other')

        await act(() => {
            fireEvent.click(getByText('Company'))

            return Promise.resolve()
        })

        expect(onChoose).toHaveBeenCalledTimes(1)
        expect(onChoose.mock.calls[0][0].id).toEqual('company-presentation')
    })
})