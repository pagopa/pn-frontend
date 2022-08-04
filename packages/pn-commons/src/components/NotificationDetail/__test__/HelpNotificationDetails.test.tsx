import React from 'react';
import { act, RenderResult } from '@testing-library/react';
import { render } from "../../../test-utils";
import HelpNotificationDetails from "../HelpNotificationDetails";

/**
 * The component HelpNotificationDetails includes a useEffect which depends on some props,
 * and which launches an async function (namely, a format validation using yup, which is always async).
 * Hence the need to use the act function and to redefine the result.
 * 
 * Cfr https://stackoverflow.com/questions/56722139/when-testing-code-that-causes-react-state-updates-should-be-wrapped-into-act.
 * ---------------------------
 * Carlos Lombardi, 2022.08.01 
 */
describe('tests HelpNotificationDetails component', () => {
    let result: RenderResult | undefined;

    afterEach(() => {
        result = undefined;
    });
    
    it('renders the component', async () => {
        await act(async () => {
            result = await render(
                <HelpNotificationDetails
                    title={'test title'}
                    subtitle={'test subtitle'}
                    courtName={'test court'}
                    phoneNumber={'3334455566'}
                    mail={'test@test.it'}
                    website={'https://test.com'}
                />
            );
        });

        expect(result?.container).toHaveTextContent('TEST TITLE')
        expect(result?.container).toHaveTextContent('test subtitle')
        expect(result?.container).toHaveTextContent('test court')
        expect(result?.container).toHaveTextContent('3334455566')
        expect(result?.container).toHaveTextContent('test@test.it')
        expect(result?.container).toHaveTextContent('Vai al sito')
    });

    it('does not render malformed phone number', async () => {
        await act(async () => {
            result = await render(
                <HelpNotificationDetails
                    title={'test title'}
                    subtitle={'test subtitle'}
                    courtName={'test court'}
                    phoneNumber={'this is not a phone'}
                    mail={'test@test.it'}
                    website={'https://test.com'}
                />
            );
        });

        expect(result?.container).toHaveTextContent('TEST TITLE')
        expect(result?.container).toHaveTextContent('test subtitle')
        expect(result?.container).toHaveTextContent('test court')
        expect(result?.container).not.toHaveTextContent('this is not a phone')
        expect(result?.container).toHaveTextContent('test@test.it')
        expect(result?.container).toHaveTextContent('Vai al sito')
    });


    it('does not render malformed mail or website', async () => {
        await act(async () => {
            result = await render(
                <HelpNotificationDetails
                    title={'test title'}
                    subtitle={'test subtitle'}
                    courtName={'test court'}
                    phoneNumber={'3334455566'}
                    mail={'bad test@test.it'}
                    website={'go baby go'}
                />
            );
        });

        expect(result?.container).toHaveTextContent('TEST TITLE')
        expect(result?.container).toHaveTextContent('test subtitle')
        expect(result?.container).toHaveTextContent('test court')
        expect(result?.container).toHaveTextContent('3334455566')
        expect(result?.container).not.toHaveTextContent('test@test.it')
        expect(result?.container).not.toHaveTextContent('Vai al sito')
    });
});