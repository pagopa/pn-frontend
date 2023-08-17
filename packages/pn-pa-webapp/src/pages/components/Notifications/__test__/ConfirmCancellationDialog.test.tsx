import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import ConfirmCancellationDialog from '../ConfirmCancellationDialog';

type Props = {
  showModal: boolean;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  payment: boolean;
};

// const renderConfirmCancellatioDialog = ({ showModal, onConfirm, onClose, payment }: Props) =>

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('render dialog', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test.only('check dialog text with not payment', async () => {
    render(
      <ConfirmCancellationDialog
        showModal={true}
        onClose={onClose}
        onConfirm={onConfirm}
        payment={false}
      ></ConfirmCancellationDialog>
    );
    screen.debug();

    const dialog = screen.getByTestId('dialogText');
    await waitFor(() => {
      expect(dialog).toHaveTextContent('detail.cancel-notification-modal.message');
    });
  });

  test('check dialog text with payment', async () => {
    const result = renderConfirmCancellatioDialog({
      showModal: true,
      onConfirm,
      onClose,
      payment: true,
    });

    const dialog = result.getByTestId('dialogText');
    expect(dialog).toHaveTextContent('detail.cancel-notification-modal.message-with-payment');
  });

  it('checks that the confirm and cancel functions are executed', async () => {
    const result = renderConfirmCancellatioDialog({
      showModal: true,
      onConfirm,
      onClose,
      payment: false,
    });
    const confirm = result.getByTestId('modalCloseBtnId');
    const cancel = result.getByTestId('modalCloseAndProceedBtnId');

    fireEvent.click(confirm);
    await waitFor(() => {
      expect(onConfirm).toBeCalledTimes(1);
    });

    fireEvent.click(cancel);
    await waitFor(() => {
      expect(onClose).toBeCalledTimes(1);
    });
  });

  it('checks that the confirm and cancel functions are executed with payment', async () => {
    const result = renderConfirmCancellatioDialog({
      showModal: true,
      onConfirm,
      onClose,
      payment: true,
    });

    const confirm = result.getByTestId('modalCloseAndProceedBtnId');
    expect(confirm).toBeDisabled();
    const checkbox = result.getByTestId('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(confirm).not.toBeDisabled();
    });
    const cancel = result.getByTestId('modalCloseBtnId');

    fireEvent.click(confirm);
    await waitFor(() => {
      expect(onConfirm).toBeCalledTimes(1);
    });

    fireEvent.click(cancel);
    await waitFor(() => {
      expect(onClose).toBeCalledTimes(1);
    });
  });
});
