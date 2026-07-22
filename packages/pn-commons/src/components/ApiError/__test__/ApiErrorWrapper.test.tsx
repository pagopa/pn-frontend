import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from '../../../test-utils';
import ApiErrorWrapper from '../ApiErrorWrapper';

const mockApiError = 'mockApiId';
// Mocking the useErrors hook, since the hook is already tested
vi.mock('../../../hooks/useErrors', () => ({
  useErrors: () => ({
    hasApiErrors: (apiId: string) => apiId === mockApiError, // Mocking hasApiErrors function
  }),
}));

describe('ApiErrorWrapper', () => {
  const reloadText = 'Ricarica';
  const user = userEvent.setup();

  beforeAll(() => {
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('mocks reload function', () => {
    expect(vi.isMockFunction(window.location.reload)).toBe(true);
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

  it('renders ApiError with custom mainText when there are API errors', () => {
    const errorText = 'Error Text';
    render(
      <ApiErrorWrapper apiId={mockApiError} mainText={errorText}>
        <div data-testid="child-element">Child content</div>
      </ApiErrorWrapper>
    );

    const apiError = screen.getByTestId(`api-error-${mockApiError}`);
    expect(apiError).toBeInTheDocument();
    expect(apiError).toHaveTextContent(errorText);
  });

  it('renders the custom error component when there are API errors', () => {
    render(
      <ApiErrorWrapper
        apiId={mockApiError}
        customErrorComponent={<div data-testid="custom-error">Custom error</div>}
      >
        <div data-testid="child-element">Child content</div>
      </ApiErrorWrapper>
    );

    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    expect(screen.queryByTestId(`api-error-${mockApiError}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId('child-element')).not.toBeInTheDocument();
  });

  it('calls reloadAction when the ApiError reload action is clicked', async () => {
    const reloadActionMock = vi.fn();

    render(
      <ApiErrorWrapper apiId={mockApiError} reloadAction={reloadActionMock}>
        <div data-testid="child-element">Child content</div>
      </ApiErrorWrapper>
    );

    const reloadItemComponent = screen.getByText(reloadText);
    expect(reloadItemComponent).toBeInTheDocument();
    await user.click(reloadItemComponent);

    await waitFor(() => {
      expect(reloadActionMock).toHaveBeenCalled();
    });
  });

  it('reloads the page when no reloadAction is provided', async () => {
    render(
      <ApiErrorWrapper apiId={mockApiError}>
        <div data-testid="child-element">Child content</div>
      </ApiErrorWrapper>
    );

    const reloadItemComponent = screen.getByText(reloadText);
    expect(reloadItemComponent).toBeInTheDocument();
    await user.click(reloadItemComponent);

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
