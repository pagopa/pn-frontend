import React from 'react';

import { fireEvent, waitFor, within } from '@testing-library/react';

import { render } from '../../../test-utils';
import { MessageType } from '../../../types';
import SnackBar from '../SnackBar';

const snackBarProps = {
  message: 'SnackBar mocked message',
};

const renderSnackBar = (open: boolean, type: MessageType, closingDelay?: number) =>
  render(
    <SnackBar
      open={open}
      message={snackBarProps.message}
      type={type}
      closingDelay={closingDelay}
      id={'mocked-id'}
    />
  );

describe('SnackBar Component', () => {
  it('renders snack bar (closed)', () => {
    const result = renderSnackBar(false, MessageType.INFO);
    const snackBarContainer = result?.queryByTestId('snackBarContainer');
    expect(snackBarContainer).not.toBeInTheDocument();
  });

  it('renders snack bar (opened)', () => {
    const result = renderSnackBar(true, MessageType.INFO);
    const snackBarContainer = result?.getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    expect(snackBarContainer).toHaveTextContent(snackBarProps.message);
  });

  it('closes snack bar by clicking close button', async () => {
    const result = renderSnackBar(true, MessageType.INFO);
    const snackBarContainer = result?.getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    const closeButton = within(snackBarContainer!).getByRole('button');
    await waitFor(() => {
      fireEvent.click(closeButton!);
    });
    expect(snackBarContainer).not.toBeInTheDocument();
  });

  it('closes snack bar after delay', async () => {
    const result = renderSnackBar(true, MessageType.INFO, 400);
    const snackBarContainer = result?.getByTestId('snackBarContainer');
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
