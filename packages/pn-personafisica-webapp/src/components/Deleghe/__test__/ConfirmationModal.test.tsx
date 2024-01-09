import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import ConfirmationModal from '../ConfirmationModal';

const mockCancelFunction = vi.fn();
const mockConfirmFunction = vi.fn();

describe('ConfirmationModal Component', () => {
  it('renders the component', () => {
    const { getByRole, getAllByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        handleClose={mockCancelFunction}
        onCloseLabel={'Cancel'}
        open
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Confirm'}
      />
    );
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    const dialogActions = getAllByTestId('dialogAction');
    expect(dialogActions).toHaveLength(2);
    expect(dialogActions[1]).toHaveTextContent(/Confirm/i);
    expect(dialogActions[0]).toHaveTextContent(/Cancel/i);
  });

  it('checks that the confirm and cancel functions are executed', () => {
    const { getAllByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        handleClose={mockCancelFunction}
        onCloseLabel={'Cancel'}
        open
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Confirm'}
      />
    );
    const dialogActions = getAllByTestId('dialogAction');
    const confirm = dialogActions[1];
    const cancel = dialogActions[0];
    fireEvent.click(confirm);
    expect(mockConfirmFunction).toBeCalledTimes(1);
    fireEvent.click(cancel);
    expect(mockCancelFunction).toBeCalledTimes(1);
  });

  it('renders the dialog with default labels', () => {
    const { getAllByTestId } = render(
      <ConfirmationModal
        title={'Test title'}
        handleClose={mockCancelFunction}
        open
        onConfirm={mockConfirmFunction}
      />
    );
    const dialogActions = getAllByTestId('dialogAction');
    const confirm = dialogActions[1];
    const cancel = dialogActions[0];
    expect(confirm).toHaveTextContent(/Riprova/i);
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with no confirm button', () => {
    const { getAllByTestId } = render(
      <ConfirmationModal title={'Test title'} handleClose={mockCancelFunction} open />
    );
    const dialogActions = getAllByTestId('dialogAction');
    expect(dialogActions).toHaveLength(1);
    expect(dialogActions[0]).toHaveTextContent(/Annulla/i);
  });
});
