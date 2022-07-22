import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import Layout from "../Layout";


// const mockAssistanceFn = jest.fn(); // Email assistance to be implemented

describe('Layout component', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('rendering Layout', () => {
        const result = render(<Layout>Mocked Child</Layout>);
        expect(result.container).toHaveTextContent(/Mocked Child/i);
    });

    it('click assistance button', async () => {
        const result = render(<Layout>Mocked Child</Layout>);
        const button = result.container.querySelector('button');
        expect(button).toBeInTheDocument();
        await waitFor(() => fireEvent.click(button!));
        // expect(mockAssistanceFn).toBeCalledTimes(1); // Email assistance to be implemented
    });

    it('click language button', async () => {
        const result = render(<Layout>Mocked Child</Layout>);
        const button = result.container.querySelector('button[aria-label="lang-menu-button"]');
        fireEvent.click(button!);
        const languageSelector = await waitFor(() => screen.queryByRole('presentation'));
        expect(languageSelector).toBeInTheDocument();
        const languagesFirstElement = languageSelector?.querySelector('ul li');
        expect(languagesFirstElement).toBeInTheDocument();
        await waitFor(() => fireEvent.click(languagesFirstElement!));
        const languageSelectorNull = await waitFor(() => screen.queryByRole('presentation'));
        expect(languageSelectorNull).toBeNull();
    });
})
