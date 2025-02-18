import { vi } from 'vitest';

import { fireEvent, render } from '../../test-utils';
import ConfirmationModal from '../ConfirmationModal';

const mockCancelFunction = vi.fn();
const mockConfirmFunction = vi.fn();

describe('ConfirmationModal Component', () => {
  it('renders the component', () => {
    const { getByRole, getByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        onClose={mockCancelFunction}
        onCloseLabel={'Cancel'}
        open
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Confirm'}
      />
    );

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    const confirmButton = getByTestId('confirmButton');
    const closeButton = getByTestId('closeButton');
    expect(confirmButton).toHaveTextContent(/Confirm/i);
    expect(closeButton).toHaveTextContent(/Cancel/i);
  });

  it('checks that the confirm and cancel functions are executed', () => {
    const { getByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        onClose={mockCancelFunction}
        onCloseLabel={'Cancel'}
        open
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Confirm'}
      />
    );

    const confirmButton = getByTestId('confirmButton');
    const cancelButton = getByTestId('closeButton');
    fireEvent.click(confirmButton);
    expect(mockConfirmFunction).toHaveBeenCalledTimes(1);
    fireEvent.click(cancelButton);
    expect(mockCancelFunction).toHaveBeenCalledTimes(1);
  });

  it('renders the dialog with default labels', () => {
    const { getByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        onClose={mockCancelFunction}
        open
        onConfirm={mockConfirmFunction}
      />
    );

    const confirmButton = getByTestId('confirmButton');
    const cancelButton = getByTestId('closeButton');
    expect(confirmButton).toHaveTextContent(/Riprova/i);
    expect(cancelButton).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with no confirm button', () => {
    const { getByTestId, queryByTestId } = render(
      <ConfirmationModal title={'Test title'} onClose={mockCancelFunction} open />
    );
    const confirmButton = queryByTestId('confirmButton');
    const cancelButton = getByTestId('closeButton');
    expect(confirmButton).not.toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/Annulla/i);
  });
});
