import { vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import ConfirmCancellationDialog from '../ConfirmCancellationDialog';

describe('render dialog', () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('check dialog text with not payment', async () => {
    render(
      <ConfirmCancellationDialog
        showModal={true}
        onClose={onClose}
        onConfirm={onConfirm}
        payment={false}
      ></ConfirmCancellationDialog>
    );

    const dialog = screen.getByTestId('dialogText');
    await waitFor(() => {
      expect(dialog).toHaveTextContent('detail.cancel-notification-modal.message');
    });
  });

  it('check dialog text with payment', async () => {
    render(
      <ConfirmCancellationDialog
        showModal={true}
        onClose={onClose}
        onConfirm={onConfirm}
        payment={true}
      ></ConfirmCancellationDialog>
    );
    const dialog = screen.getByTestId('dialogText');
    expect(dialog).toHaveTextContent('detail.cancel-notification-modal.message-with-payment');
  });

  it('checks that the confirm and cancel functions are executed', async () => {
    render(
      <ConfirmCancellationDialog
        showModal={true}
        onClose={onClose}
        onConfirm={onConfirm}
        payment={false}
      ></ConfirmCancellationDialog>
    );

    const confirm = screen.getByTestId('modalCloseAndProceedBtnId');
    const cancel = screen.getByTestId('modalCloseBtnId');

    fireEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(cancel);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('checks that the confirm and cancel functions are executed with payment', async () => {
    render(
      <ConfirmCancellationDialog
        showModal={true}
        onClose={onClose}
        onConfirm={onConfirm}
        payment={true}
      ></ConfirmCancellationDialog>
    );

    const confirm = screen.getByTestId('modalCloseAndProceedBtnId');
    expect(confirm).toBeDisabled();
    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(confirm).not.toBeDisabled();
    });
    const cancel = screen.getByTestId('modalCloseBtnId');

    fireEvent.click(confirm);
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(cancel);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
