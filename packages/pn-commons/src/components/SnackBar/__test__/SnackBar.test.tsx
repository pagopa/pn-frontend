import { vi } from 'vitest';

import { MessageType } from '../../../models';
import { fireEvent, render, waitFor, within } from '../../../test-utils';
import SnackBar from '../SnackBar';

const renderSnackBar = (open: boolean, type: MessageType, closingDelay?: number) =>
  render(
    <SnackBar
      open={open}
      message={'SnackBar mocked message'}
      type={type}
      closingDelay={closingDelay}
    />
  );

describe('SnackBar Component', () => {
  it('renders snack bar (closed)', () => {
    const { queryByTestId } = renderSnackBar(false, MessageType.INFO);
    const snackBarContainer = queryByTestId('snackBarContainer');
    expect(snackBarContainer).not.toBeInTheDocument();
  });

  it('renders snack bar (opened)', () => {
    const { getByTestId } = renderSnackBar(true, MessageType.INFO);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    expect(snackBarContainer).toHaveTextContent('SnackBar mocked message');
  });

  it('closes snack bar by clicking close button', async () => {
    const { getByTestId } = renderSnackBar(true, MessageType.INFO);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    const closeButton = within(snackBarContainer!).getByRole('button');
    await waitFor(() => {
      fireEvent.click(closeButton!);
    });
    expect(snackBarContainer).not.toBeInTheDocument();
  });

  // TO-FIX
  // This test fails, probably due of the combination of useFakeTimers with a waitFor block.
  // I skip it to go forward with the migration jest -> vitest.
  // To analyze jointly with the skipped tests in src/components/NotificationDetail/__test__/NotificationPaymentF24Item.test.tsx
  // and src/hooks/__test__/useProcess.test.tsx
  // ---------------------------------
  // Carlos Lombardi, 2023-11-10
  // ---------------------------------
  it('closes snack bar after delay', async () => {
    vi.useFakeTimers();
    const { getByTestId } = renderSnackBar(true, MessageType.INFO, 400);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait...
    vi.advanceTimersByTime(500);

    vi.useRealTimers();
    await waitFor(() => {
      expect(snackBarContainer).not.toBeInTheDocument();
    });
  });
});
