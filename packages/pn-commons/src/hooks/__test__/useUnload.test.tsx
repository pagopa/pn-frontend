import React from "react";
import { useUnload } from "../useUnload";
import { render } from '../../test-utils';

describe("useUnload", () => {

    it("should call the provided function on 'beforeunload'", () => {
        const mockCallback = jest.fn();

        const { unmount } = render(<MockComponent fn={mockCallback} />);

        // Trigger the beforeunload event
        window.dispatchEvent(new Event('beforeunload'));

        // Expect the callback to have been called
        expect(mockCallback).toHaveBeenCalled();

        // Trigger the 'beforeunload' event listener
        unmount();
        // Trigger the beforeunload event again
        window.dispatchEvent(new Event('beforeunload'));

        // Expect the callback not to have been called this time (therefore it has been called only once during test execution)
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});

function MockComponent({ fn }) {
    useUnload(fn);
    return <div>Mock Component</div>;
}
