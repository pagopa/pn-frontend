import React from 'react';

import { MessageType } from '../../../models';
import { fireEvent, render, waitFor, within } from '../../../test-utils';
import SnackBar from '../SnackBar';

const snackBarProps = {
  message: 'SnackBar mocked message',
};

const renderSnackBar = (open: boolean, type: MessageType, closingDelay?: number) =>
  render(
    <SnackBar open={open} message={snackBarProps.message} type={type} closingDelay={closingDelay} />
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
    expect(snackBarContainer).toHaveTextContent(snackBarProps.message);
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

  it('closes snack bar after delay', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderSnackBar(true, MessageType.INFO, 400);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait...
    jest.advanceTimersByTime(500);
    await waitFor(() => {
      expect(snackBarContainer).not.toBeInTheDocument();
    });
  });
});
