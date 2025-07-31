import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContactItem from '../SpecialContactItem';

describe('SpecialContactItem Component', () => {
  let mock: MockAdapter;
  const editHandler = vi.fn();
  const deleteHandler = vi.fn();
  const cancelValidationHandler = vi.fn();

  const pecAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.PEC,
    value: 'mocked@pec.it',
    pecValid: true,
  };

  const sercqAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: ChannelType.SERCQ_SEND,
    value: 'sercq_address',
    codeValid: true,
  };

  const emailAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.EMAIL,
    value: 'mocked@email.it',
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders SpecialContactElem', () => {
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactItem
        address={pecAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent('mocked@pec.it');
    const pecButtons = specialContactForms[0].querySelectorAll('button');
    expect(pecButtons).toHaveLength(2);
    expect(pecButtons[0]).toHaveTextContent('button.modifica');
    expect(pecButtons[1]).toHaveTextContent('button.elimina');
  });

  it('should show pec validation progress if pec is not valid', () => {
    const pecNotValid = {
      ...pecAddress,
      pecValid: false,
    };
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactItem
        address={pecNotValid}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(`${pecNotValid.senderId}_pecContact`);
    expect(specialContactForms).toHaveLength(1);
    const buttons = specialContactForms[0].querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('legal-contacts.cancel-pec-validation');

    fireEvent.click(buttons[0]);
    expect(cancelValidationHandler).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is clicked', async () => {
    // render component
    const { getAllByTestId, container } = render(
      <SpecialContactItem
        address={pecAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_emailSpecialContact|_smsSpecialContact)$/
    );
    const buttons = specialContactForms[0].querySelectorAll('button');
    fireEvent.click(buttons[0]);
    // Click Confirm button of DigitalContact
    const confirmButton = container.querySelectorAll('button');
    fireEvent.click(confirmButton[0]);
    await waitFor(() => expect(editHandler).toHaveBeenCalledTimes(1));
  });

  it('calls onDelete when delete button is clicked', async () => {
    // render component
    const { getAllByTestId } = render(
      <SpecialContactItem
        address={pecAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_emailSpecialContact|_smsSpecialContact)$/
    );
    const buttons = specialContactForms[0].querySelectorAll('button');
    fireEvent.click(buttons[1]);
    await waitFor(() => expect(deleteHandler).toHaveBeenCalledTimes(1));
  });

  it('should show Domicilio Digitale SEND value and no edit button', () => {
    const { getAllByTestId } = render(
      <SpecialContactItem
        address={sercqAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    const specialContactForms = getAllByTestId(/sercq_sendSpecialContact$/);
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent('special-contacts.sercq_send');
    const buttons = specialContactForms[0].querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('button.disable');
  });

  it('renders SpecialContactElem - courtesy address', () => {
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactItem
        address={emailAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
      />
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent('mocked@email.it');
    const emailuttons = specialContactForms[0].querySelectorAll('button');
    expect(emailuttons).toHaveLength(1);
    expect(emailuttons[0]).toHaveTextContent('button.elimina');
  });

  it('renders SpecialContactElem without sender - courtesy address', () => {
    // render component
    const { container } = render(
      <SpecialContactItem
        address={emailAddress}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        showSenderName={false}
      />
    );

    expect(container).not.toHaveTextContent('Mocked Sender');
  });
});
