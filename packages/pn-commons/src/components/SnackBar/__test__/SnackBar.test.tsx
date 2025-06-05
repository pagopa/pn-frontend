import { vi } from 'vitest';

import { AppResponseOutcome } from '../../../models/AppResponse';
import { act, fireEvent, render, waitFor, within } from '../../../test-utils';
import SnackBar from '../SnackBar';

const renderSnackBar = (open: boolean, type: AppResponseOutcome, closingDelay?: number) =>
  render(
    <SnackBar
      open={open}
      type={type}
      message={{
        id: '',
        blocking: false,
        title: '',
        toNotify: false,
        alreadyShown: false,
        message: 'SnackBar mocked message',
        showTechnicalData: false,
      }}
      closingDelay={closingDelay}
    />
  );

describe('SnackBar Component', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  it('renders snack bar (closed)', () => {
    const { queryByTestId } = renderSnackBar(false, AppResponseOutcome.INFO);
    const snackBarContainer = queryByTestId('snackBarContainer');
    expect(snackBarContainer).not.toBeInTheDocument();
  });

  it('renders snack bar (opened)', () => {
    const { getByTestId } = renderSnackBar(true, AppResponseOutcome.INFO);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    expect(snackBarContainer).toHaveTextContent('SnackBar mocked message');
  });

  it('closes snack bar by clicking close button', async () => {
    const { getByTestId } = renderSnackBar(true, AppResponseOutcome.INFO);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    const closeButton = within(snackBarContainer!).getByRole('button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(snackBarContainer).not.toBeInTheDocument();
    });
  });

  it('closes snack bar after delay', async () => {
    vi.useFakeTimers();
    const { getByTestId } = renderSnackBar(true, AppResponseOutcome.INFO, 400);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait...
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(snackBarContainer).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders technical details when showTechnicalData is true', () => {
    const { getByText } = render(
      <SnackBar
        open={true}
        type={AppResponseOutcome.ERROR}
        message={{
          id: 'msg1',
          blocking: false,
          title: 'Something went wrong',
          toNotify: false,
          alreadyShown: false,
          message: 'A technical error occurred.',
          showTechnicalData: true,
          errorCode: 'ERR-500',
          traceId: 'trace-xyz-123',
        }}
      />
    );

    // Assert main content
    expect(getByText('Something went wrong')).toBeInTheDocument();
    expect(getByText('A technical error occurred.')).toBeInTheDocument();

    // Assert technical details section
    expect(getByText('ERR-500')).toBeInTheDocument();
    expect(getByText('trace-xyz-123')).toBeInTheDocument();
    expect(getByText(/Copia informazioni errore/i)).toBeInTheDocument(); // fallback localization
  });
});
