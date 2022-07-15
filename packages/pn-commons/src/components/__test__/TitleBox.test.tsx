import { render } from "../../test-utils";
import TitleBox from "../TitleBox";

describe('test TitleBox component', () => {
    test('renders the full component', () => {
        const result = render(<TitleBox title={'Test title'} subTitle={'Test subtitle'}/>);

        expect(result.container).toHaveTextContent(/test title/i);
        expect(result.container).toHaveTextContent(/test subtitle/i);
    });
});