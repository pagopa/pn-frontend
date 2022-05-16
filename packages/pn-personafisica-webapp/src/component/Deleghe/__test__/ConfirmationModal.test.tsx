import { fireEvent } from '@testing-library/react';
import * as hooks from '@pagopa-pn/pn-commons/src/hooks/IsMobile';
import * as React from 'react';
import { render } from '../../../__test__/test-utils';

import ConfirmationModal from '../ConfirmationModal';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

const mockCancelFunction = jest.fn();
const mockConfirmFunction = jest.fn();

type Props = {
  open?: boolean;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmLabel?: string;
  onCloseLabel?: string;
};

const renderConfirmationModal = ({ open = true, onConfirm, onConfirmLabel, onCloseLabel }: Props) =>
  render(
    <ConfirmationModal
      title={'Test title'}
      handleClose={mockCancelFunction}
      onCloseLabel={onCloseLabel}
      open={open}
      onConfirm={onConfirm}
      onConfirmLabel={onConfirmLabel}
    />
  );

describe('ConfirmationModal Component', () => {
  afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
  });

  it('renders the component', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = renderConfirmationModal({
      onConfirm: mockConfirmFunction,
      onConfirmLabel: 'Conferma',
      onCloseLabel: 'Cancella',
    });
    const dialog = result!.queryByRole('dialog');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Conferma/i);
    expect(dialog).toHaveTextContent(/Cancella/i);
  });

  it('checks that the confirm and cancel functions are executed', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = renderConfirmationModal({ onConfirm: mockConfirmFunction });
    const confirm = result!.queryAllByTestId('dialogAction')[1];
    const cancel = result!.queryAllByTestId('dialogAction')[0];

    fireEvent.click(confirm);
    expect(mockConfirmFunction).toBeCalledTimes(1);

    fireEvent.click(cancel);
    expect(mockCancelFunction).toBeCalledTimes(1);
  });

  it('renders the dialog with default labels', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = renderConfirmationModal({ onConfirm: mockConfirmFunction });

    const confirm = result!.queryAllByTestId('dialogAction')[1];
    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(confirm).toHaveTextContent(/Riprova/i);
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with no confirm button', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = renderConfirmationModal({});

    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog closed', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = renderConfirmationModal({ open: false });

    const dialog = result!.queryByRole('dialog');

    expect(dialog).toBeNull();
  });

  it('renders the mobile view of the dialog', () => {
    useIsMobileSpy.mockReturnValue(true);
    const result = renderConfirmationModal({
      onConfirm: mockConfirmFunction,
      onConfirmLabel: 'Conferma',
      onCloseLabel: 'Cancella',
    });
    const buttons = result!.queryAllByTestId('dialogAction');
    const dialog = result!.queryByRole('dialog');
    const stack = result.queryByTestId('dialogStack');

    expect(dialog).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(stack).toHaveStyle('flex-direction: column');
  });
});
