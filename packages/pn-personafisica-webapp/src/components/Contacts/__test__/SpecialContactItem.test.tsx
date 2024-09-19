import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContactItem from '../SpecialContactItem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('SpecialContactItem Component', () => {
  let mock: MockAdapter;
  const editHandler = vi.fn();
  const deleteHandler = vi.fn();
  const cancelValidationHandler = vi.fn();
  const createNewAssociationHandler = vi.fn();

  const pecAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.PEC,
    value: 'mocked@pec.it',
    pecValid: true,
  };

  const emailAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.EMAIL,
    value: 'mocked@mail.it',
  };

  const phoneAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.SMS,
    value: '+39333333333',
  };

  const sercqAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: ChannelType.SERCQ_SEND,
    value: 'sercq_address',
    codeValid: true,
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders SpecialContactElem', () => {
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactItem
        addresses={[pecAddress, emailAddress, phoneAddress]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(3);
    expect(specialContactForms[0]).toHaveTextContent('mocked@pec.it');
    expect(specialContactForms[1]).toHaveTextContent('mocked@mail.it');
    const pecButtons = specialContactForms[0].querySelectorAll('button');
    expect(pecButtons).toHaveLength(2);
    expect(pecButtons[0]).toHaveTextContent('button.modifica');
    expect(pecButtons[1]).toHaveTextContent('button.elimina');
    const emailButtons = specialContactForms[1].querySelectorAll('button');
    expect(emailButtons).toHaveLength(2);
    expect(emailButtons[0]).toHaveTextContent('button.modifica');
    expect(emailButtons[1]).toHaveTextContent('button.elimina');
    const phoneButtons = specialContactForms[2].querySelectorAll('button');
    expect(phoneButtons).toHaveLength(2);
    expect(phoneButtons[0]).toHaveTextContent('button.modifica');
    expect(phoneButtons[1]).toHaveTextContent('button.elimina');
    const addMoreSpecialContacts = container.querySelector(
      '[data-testid="addMoreSpecialContacts"]'
    );
    expect(addMoreSpecialContacts).not.toBeInTheDocument();
  });

  it('should show pec validation progress if pec is not valid', () => {
    const pecNotValid = {
      ...pecAddress,
      pecValid: false,
    };
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactItem
        addresses={[pecNotValid]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent('legal-contacts.pec-validating');
    const buttons = specialContactForms[0].querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('legal-contacts.cancel-pec-validation');

    fireEvent.click(buttons[0]);
    expect(cancelValidationHandler).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is clicked', async () => {
    // render component
    const { getAllByTestId } = render(
      <SpecialContactItem
        addresses={[pecAddress, emailAddress]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />
    );

    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    const buttons = specialContactForms[0].querySelectorAll('button');
    fireEvent.click(buttons[0]);
    await waitFor(() => expect(editHandler).toHaveBeenCalledTimes(1));
  });

  it('calls onDelete when delete button is clicked', async () => {
    // render component
    const { getAllByTestId } = render(
      <SpecialContactItem
        addresses={[pecAddress, emailAddress]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />
    );

    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    const buttons = specialContactForms[0].querySelectorAll('button');
    fireEvent.click(buttons[1]);
    await waitFor(() => expect(deleteHandler).toHaveBeenCalledTimes(1));
  });

  it('should render add button and call createNewAssociationHandler when is clicked', () => {
    const defaultPecAddress = { ...pecAddress, senderId: 'default' };
    const defaultEmailAddress = { ...emailAddress, senderId: 'default' };
    const deafultPhoneAddress = { ...phoneAddress, senderId: 'default' };
    const { container } = render(
      <SpecialContactItem
        addresses={[pecAddress, emailAddress]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [defaultPecAddress, defaultEmailAddress, deafultPhoneAddress],
          },
        },
      }
    );

    const addMoreSpecialContacts = container.querySelector(
      '[data-testid="addMoreSpecialContacts"]'
    );
    expect(addMoreSpecialContacts).toBeInTheDocument();
    fireEvent.click(addMoreSpecialContacts!);
    expect(createNewAssociationHandler).toHaveBeenCalledTimes(1);
  });

  it('should show Domicilio Digitale SEND value and no edit button', () => {
    const { getAllByTestId } = render(
      <SpecialContactItem
        addresses={[sercqAddress]}
        onDelete={deleteHandler}
        onEdit={editHandler}
        onCancelValidation={cancelValidationHandler}
        handleCreateNewAssociation={createNewAssociationHandler}
      />
    );

    const specialContactForms = getAllByTestId(/_sercqContact$/);
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent('special-contacts.sercq_send');
    const buttons = specialContactForms[0].querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('button.disable');
  });
});
