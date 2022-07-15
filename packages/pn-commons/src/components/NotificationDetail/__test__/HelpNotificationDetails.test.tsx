import { render } from "../../../test-utils";
import HelpNotificationDetails from "../HelpNotificationDetails";

describe('tests HelpNotificationDetails component', () => {
    it('renders the component', () => {
        const result = render(
            <HelpNotificationDetails
                title={'test title'}
                subtitle={'test subtitle'}
                courtName={'test court'}
                phoneNumber={'3334455566'}
                mail={'test@test.it'}
                website={'test.com'}
            />
        )

        expect(result.container).toHaveTextContent('TEST TITLE')
        expect(result.container).toHaveTextContent('test subtitle')
        expect(result.container).toHaveTextContent('test court')
        expect(result.container).toHaveTextContent('3334455566')
        expect(result.container).toHaveTextContent('test@test.it')
        expect(result.container).toHaveTextContent('Vai al sito')
    })
});