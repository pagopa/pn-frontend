import { useIsMobile } from "../IsMobile";
import { render } from "../../test-utils";

const Component = () => {
    const isMobile = useIsMobile();

    return (
        <div>{JSON.stringify(isMobile)}</div>
    )
}

describe('test IsMobile hook', () => {
    test('hook should return false', () => {
        Object.assign(window, { innerWidth: 2000 });
        const result = render(<Component />)

        expect(result.container).toHaveTextContent('false')
    });

    test('hook should return false', () => {
        Object.assign(window, { innerWidth: 800 });
        const result = render(<Component />)

        expect(result.container).toHaveTextContent('true')
    });
});