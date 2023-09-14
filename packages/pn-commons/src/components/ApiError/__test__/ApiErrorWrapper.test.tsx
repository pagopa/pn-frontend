import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiErrorWrapper from '../ApiErrorWrapper';

// Mocking the useErrors hook
jest.mock('../../../hooks', () => ({
    useErrors: () => ({
        hasApiErrors: (apiId) => apiId === 'mockApiId', // Mocking hasApiErrors function
    }),
}));

describe('ApiErrorWrapper', () => {
    it('renders children when there are no API errors', () => {
        render(
            <ApiErrorWrapper apiId="otherApiId">
                <div data-testid="child-element">Child Content</div>
            </ApiErrorWrapper>
        );

        const childElement = screen.getByTestId('child-element');
        expect(childElement).toBeInTheDocument();
    });

    it('renders errorComponent when there are API errors', () => {
        render(
            <ApiErrorWrapper apiId="mockApiId" mainText="Error Text">
                <div data-testid="child-element">Child content</div>
            </ApiErrorWrapper>
        );

        const errorComponent = screen.getByText('Error Text');
        expect(errorComponent).toBeInTheDocument();
    });

    it('calls reloadAction when errorComponent is clicked', async () => {
        const reloadActionMock = jest.fn();

        render(
            <ApiErrorWrapper apiId="mockApiId" reloadAction={reloadActionMock}>
                <div data-testid="child-element">Child content</div>
            </ApiErrorWrapper>
        );

        const errorComponent = screen.getByText('Ricarica');
        expect(errorComponent).toBeInTheDocument();
        userEvent.click(errorComponent);

        await waitFor(() => {
            expect(reloadActionMock).toHaveBeenCalled();
        });

    });
});
