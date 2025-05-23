import { vi } from 'vitest';

import { AppResponseOutcome } from '../../../models/AppResponse';
import { act, fireEvent, render, waitFor, within } from '../../../test-utils';
import SnackBar from '../SnackBar';

const renderSnackBar = (open: boolean, type: AppResponseOutcome, closingDelay?: number) =>
  render(
    <SnackBar
      open={open}
      message={'SnackBar mocked message'}
      type={type}
      showTechnicalData={false}
      closingDelay={closingDelay}
    />
  );

describe('SnackBar Component', () => {
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
});
