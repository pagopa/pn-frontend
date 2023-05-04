import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../../__test__/test-utils';

import ConfirmationModal from '../ConfirmationModal';

// eslint-disable-next-line functional/no-let
let mockIsMobile: boolean;

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => mockIsMobile,
  };
});

const mockCancelFunction = jest.fn();
const mockConfirmFunction = jest.fn();

type Props = {
  open?: boolean;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirmLabel?: string;
  onCloseLabel?: string;
};

const renderConfirmationModal = ({ open = true, onConfirm, onConfirmLabel, onCloseLabel }: Props) =>
  render(
    <ConfirmationModal
      title={'Test title'}
      onClose={mockCancelFunction}
      onCloseLabel={onCloseLabel}
      open={open}
      onConfirm={onConfirm}
      onConfirmLabel={onConfirmLabel}
    />
  );

describe('ConfirmationModal Component', () => {
  beforeEach(() => {
    mockIsMobile = false;
  });

  it('renders the component in desktop version', () => {
    const result = renderConfirmationModal({
      onConfirm: mockConfirmFunction,
      onConfirmLabel: 'Conferma',
      onCloseLabel: 'Cancella',
    });
    const dialog = result.queryByRole('dialog');
    const stack = result.queryByTestId('dialogStack');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Conferma/i);
    expect(dialog).toHaveTextContent(/Cancella/i);
    // added this check to address explicitly that the desktop (i.e not mobile)
    // version is rendered
    expect(stack).toHaveStyle('flex-direction: row');
  });

  it('checks that the confirm and cancel functions are executed', () => {
    const result = renderConfirmationModal({ onConfirm: mockConfirmFunction });
    const confirm = result.queryAllByTestId('dialogAction')[1];
    const cancel = result.queryAllByTestId('dialogAction')[0];

    fireEvent.click(confirm);
    expect(mockConfirmFunction).toBeCalledTimes(1);

    fireEvent.click(cancel);
    expect(mockCancelFunction).toBeCalledTimes(1);
  });

  it('renders the dialog with default labels', () => {
    const result = renderConfirmationModal({ onConfirm: mockConfirmFunction });

    const confirm = result.queryAllByTestId('dialogAction')[1];
    const cancel = result.queryAllByTestId('dialogAction')[0];
    expect(confirm).toHaveTextContent(/Riprova/i);
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with no confirm button', () => {
    const result = renderConfirmationModal({});

    const cancel = result.queryAllByTestId('dialogAction')[0];
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog closed', () => {
    const result = renderConfirmationModal({ open: false });

    const dialog = result.queryByRole('dialog');

    expect(dialog).toBeNull();
  });

  it('renders the mobile view of the dialog', () => {
    mockIsMobile = true;
    const result = renderConfirmationModal({
      onConfirm: mockConfirmFunction,
      onConfirmLabel: 'Conferma',
      onCloseLabel: 'Cancella',
    });
    const buttons = result.queryAllByTestId('dialogAction');
    const dialog = result.queryByRole('dialog');
    const stack = result.queryByTestId('dialogStack');

    expect(dialog).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(stack).toHaveStyle('flex-direction: column');
  });
});
