import { render } from "../../test-utils";
import CourtesyPage from "../CourtesyPage";
import { fireEvent } from "@testing-library/react";

const mockClickFn = jest.fn()

describe('test CourtesyPage component', () => {
    test('renders the full component', () => {
        const result = render(
            <CourtesyPage
                title="Test title"
                subtitle="Test subtitle"
                onClick={mockClickFn}
                onClickLabel="Click label"
            />
        );

        const button = result.getByText("Click label");

        expect(result.container).toHaveTextContent(/test title/i);
        expect(result.container).toHaveTextContent(/test subtitle/i);
        fireEvent.click(button);
        expect(mockClickFn).toHaveBeenCalled();
    });
});