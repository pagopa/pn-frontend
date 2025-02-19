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
        slotsProps={{
          closeButton: { onClick: mockCancelFunction },
          confirmButton: { onClick: mockConfirmFunction },
        }}
        onCloseLabel={'Cancel'}
        open
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
        slotsProps={{
          closeButton: { onClick: mockCancelFunction },
          confirmButton: { onClick: mockConfirmFunction },
        }}
        onCloseLabel={'Cancel'}
        open
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
        slotsProps={{
          closeButton: { onClick: mockCancelFunction },
          confirmButton: { onClick: mockConfirmFunction },
        }}
        open
      />
    );

    const confirmButton = getByTestId('confirmButton');
    const cancelButton = getByTestId('closeButton');
    expect(confirmButton).toHaveTextContent(/Riprova/i);
    expect(cancelButton).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with children', () => {
    const { getByRole } = render(
      <ConfirmationModal
        title={'Test title'}
        slotsProps={{
          closeButton: { onClick: mockCancelFunction },
          confirmButton: { onClick: mockConfirmFunction },
        }}
        onCloseLabel={'Cancel'}
        open
        onConfirmLabel={'Confirm'}
      >
        <p>Test Content</p>
      </ConfirmationModal>
    );
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Test Content/i);
  });
});
