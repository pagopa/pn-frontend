import React from 'react';
import userEvent from '@testing-library/user-event';
import ApiErrorWrapper from '../ApiErrorWrapper';
import { render, screen, waitFor } from '../../../test-utils';

const mockApiError = 'mockApiId';
// Mocking the useErrors hook, since the hook is already tested
jest.mock('../../../hooks', () => ({
    useErrors: () => ({
        hasApiErrors: (apiId) => apiId === mockApiError, // Mocking hasApiErrors function
    }),
}));

describe('ApiErrorWrapper', () => {
    const original = window.location;
    const reloadText = 'Ricarica';

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });


    afterAll(() => {
        Object.defineProperty(window, 'location', { configurable: true, value: original });
    });


    it('mocks reload function', () => {
        expect(jest.isMockFunction(window.location.reload)).toBe(true);
    });

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
        const errorText = "Error Text";
        render(
            <ApiErrorWrapper apiId={mockApiError} mainText={errorText}>
                <div data-testid="child-element">Child content</div>
            </ApiErrorWrapper>
        );

        const errorComponent = screen.getByTestId(`api-error-${mockApiError}`);
        expect(errorComponent).toBeInTheDocument();
        expect(errorComponent).toHaveTextContent(errorText);
    });

    it('calls reloadAction when errorComponent is clicked and if a reloadAcion is specified', async () => {
        const reloadActionMock = jest.fn();

        render(
            <ApiErrorWrapper apiId={mockApiError} reloadAction={reloadActionMock}>
                <div data-testid="child-element">Child content</div>
            </ApiErrorWrapper>
        );

        const reloadItemComponent = screen.getByText(reloadText);
        expect(reloadItemComponent).toBeInTheDocument();
        userEvent.click(reloadItemComponent);

        await waitFor(() => {
            expect(reloadActionMock).toHaveBeenCalled();
        });

    });

    it('calls reloadAction when errorComponent is clicked - no reloadAction Defined ', async () => {
        render(
            <ApiErrorWrapper apiId={mockApiError}>
                <div data-testid="child-element">Child content</div>
            </ApiErrorWrapper>
        );

        const reloadItemComponent = screen.getByText(reloadText);
        expect(reloadItemComponent).toBeInTheDocument();
        userEvent.click(reloadItemComponent);

        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });

    });
});
