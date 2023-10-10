import React from 'react';

import { fireEvent, render, waitFor, within } from '../../../test-utils';
import { MessageType } from '../../../types';
import SnackBar from '../SnackBar';

const renderSnackBar = (open: boolean, type: MessageType, closingDelay?: number) =>
  render(
    <SnackBar open={open} type={type} closingDelay={closingDelay}>
      SnackBar mocked message
    </SnackBar>
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

  it('closes snack bar after delay', async () => {
    const { getByTestId } = renderSnackBar(true, MessageType.INFO, 400);
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    await waitFor(
      () => {
        expect(snackBarContainer).not.toBeInTheDocument();
      },
      {
        timeout: 400,
      }
    );
  });
});
