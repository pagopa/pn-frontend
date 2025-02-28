import { vi } from 'vitest';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import { AddressType, ChannelType, DigitalAddress, Sender } from '../../../models/contacts';
import LegalContactAssociationDialog from '../LegalContactAssociationDialog';

const confirmHandler = vi.fn();
const cancelHandler = vi.fn();

const sender: Sender = {
  senderId: 'comune-milano',
  senderName: 'Comune di Milano',
};

const oldAddress: Omit<DigitalAddress, keyof Sender> = {
  addressType: AddressType.LEGAL,
  channelType: ChannelType.PEC,
  value: 'nome.utente@pec-comune-milano.it',
};

const newAddress: Omit<DigitalAddress, keyof Sender> = {
  addressType: AddressType.LEGAL,
  channelType: ChannelType.PEC,
  value: 'nome.utente2@pec-comune-milano.it',
};

const sercqSendAddress: Omit<DigitalAddress, keyof Sender> = {
  addressType: AddressType.LEGAL,
  channelType: ChannelType.SERCQ_SEND,
  value: SERCQ_SEND_VALUE,
};

describe('LegalContactAssociationDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with a different PEC address', () => {
    // render component
    const { getByTestId } = render(
      <LegalContactAssociationDialog
        open
        sender={sender}
        newAddress={newAddress}
        oldAddress={oldAddress}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const titleEl = getById(dialog, 'confirmation-dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title');
    const bodyEl = getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description');
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
    fireEvent.click(cancelButton);
    expect(cancelHandler).toHaveBeenCalledTimes(1);
  });

  it('renders component with SERCQ_SEND and PEC', () => {
    // render component
    const { getByTestId } = render(
      <LegalContactAssociationDialog
        open
        sender={sender}
        newAddress={sercqSendAddress}
        oldAddress={oldAddress}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const titleEl = getById(dialog, 'confirmation-dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title');
    const bodyEl = getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description');
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
    fireEvent.click(cancelButton);
    expect(cancelHandler).toHaveBeenCalledTimes(1);
  });

  it('renders component with the same PEC address', () => {
    // render component
    const { getByTestId } = render(
      <LegalContactAssociationDialog
        open
        sender={sender}
        newAddress={oldAddress}
        oldAddress={oldAddress}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const titleEl = getById(dialog, 'confirmation-dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title-block');
    const bodyEl = getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description-block');
    const confirmButton = within(dialog).getByText('button.close');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = within(dialog).queryByText('button.annulla');
    expect(cancelButton).not.toBeInTheDocument();
    fireEvent.click(confirmButton);
    expect(cancelHandler).toHaveBeenCalledTimes(1);
  });

  it('renders component when SERCQ_SEND is both old and new value', () => {
    // render component
    const { getByTestId } = render(
      <LegalContactAssociationDialog
        open
        sender={sender}
        newAddress={sercqSendAddress}
        oldAddress={sercqSendAddress}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const titleEl = getById(dialog, 'confirmation-dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title-block');
    const bodyEl = getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description-block');
    const confirmButton = within(dialog).getByText('button.close');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = within(dialog).queryByText('button.annulla');
    expect(cancelButton).not.toBeInTheDocument();
    fireEvent.click(confirmButton);
    expect(cancelHandler).toHaveBeenCalledTimes(1);
  });
});
