import React from 'react';
import ApiError from '../ApiError';
import { render, screen, fireEvent } from '../../../test-utils';

describe('ApiError', () => {
    it('renders main text and action text correctly', () => {
        const mainText = 'Custom error message';
        const actionText = 'Ricarica';

        render(<ApiError mainText={mainText} />);

        const mainTextElement = screen.getByText(mainText);
        const actionTextElement = screen.getByText(actionText);

        expect(mainTextElement).toBeInTheDocument();
        expect(actionTextElement).toBeInTheDocument();
    });

    it('calls onClick callback when action text is clicked', () => {
        const onClickMock = jest.fn();

        render(<ApiError onClick={onClickMock} />);

        const actionTextElement = screen.getByText('Ricarica');

        fireEvent.click(actionTextElement);

        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('uses default main text when not provided', () => {
        render(<ApiError />);

        const defaultMainText = 'Non siamo riusciti a recuperare questi dati.';

        const mainTextElement = screen.getByText(defaultMainText);

        expect(mainTextElement).toBeInTheDocument();
    });

    it('renders with custom apiId', () => {
        const apiId = 'customApiId';

        render(<ApiError apiId={apiId} />);

        const apiErrorElement = screen.getByTestId(`api-error-${apiId}`);

        expect(apiErrorElement).toBeInTheDocument();
    });
});
