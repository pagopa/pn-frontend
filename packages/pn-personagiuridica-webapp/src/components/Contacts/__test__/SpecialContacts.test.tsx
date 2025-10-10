import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';
import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContacts from '../SpecialContacts';
import { fillCodeDialog } from './test-utils';

const specialLegalAddresses = digitalLegalAddresses.filter((addr) => addr.senderId !== 'default');
const specialCourtesyAddresses = digitalCourtesyAddresses.filter(
  (addr) => addr.senderId !== 'default'
);

describe('SpecialContacts Component', async () => {
  let mock: MockAdapter;

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

  it('renders component - with contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    const { getAllByTestId, getByTestId } = render(
      <SpecialContacts addressType={AddressType.LEGAL} />,
      {
        preloadedState: { contactsState: { digitalAddresses: specialLegalAddresses } },
      }
    );

    const specialContactsCard = getByTestId('specialContacts');
    expect(specialContactsCard).toBeInTheDocument();
    const cardTitle = within(specialContactsCard).getByText('special-contacts.card-title');
    expect(cardTitle).toBeInTheDocument();
    // contacts list
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    expect(specialContactForms).toHaveLength(specialLegalAddresses.length);
    specialLegalAddresses.forEach((addr) => {
      const addressItem = getByTestId(
        `${addr.senderId}_${addr.channelType.toLowerCase()}SpecialContact`
      );
      expect(addressItem).toBeInTheDocument();

      if (addr.channelType === ChannelType.PEC && !addr.pecValid) {
        expect(addressItem).toHaveTextContent('legal-contacts.pec-validating');
        const cancelValidationButton = within(addressItem).getByTestId('cancelValidation');
        expect(cancelValidationButton).toBeInTheDocument();
      } else {
        expect(addressItem).toHaveTextContent(addr.value);
        const editButton = within(addressItem).queryByText('button.modifica');
        expect(editButton).toBeInTheDocument();
        const deleteButton = within(addressItem).queryByText('button.elimina');
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

  it('edit special contact', async () => {
    const pecValue = 'pec-carino@valida.com';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${specialLegalAddresses[0].senderId}/PEC`, {
        value: pecValue,
      })
      .replyOnce(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`bff/v1/addresses/LEGAL/${specialLegalAddresses[0].senderId}/PEC`, {
        value: pecValue,
        verificationCode: '01234',
      })
      .replyOnce(204);
    // render component
    const result = render(<SpecialContacts addressType={AddressType.LEGAL} />, {
      preloadedState: { contactsState: { digitalAddresses: specialLegalAddresses } },
    });
    // ATTENTION: the order in the mock is very important
    // change pec
    const specialContactForms = result.getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    const editButton = within(specialContactForms[0]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(editButton);

    const input = specialContactForms[0].querySelector('input');
    fireEvent.change(input!, { target: { value: pecValue } });

    const confirmButton = within(specialContactForms[0]).getByText('button.conferma');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
    // fill the code
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const addresses = [
      {
        ...specialLegalAddresses[0],
        senderName: parties[0].name,
        value: pecValue,
      },
      ...specialLegalAddresses.slice(1),
    ];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    expect(input).not.toBeInTheDocument();
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecContact|_sercq_sendContact)$/
      );
      expect(specialContactForms[0]).toHaveTextContent(pecValue);
    });
  });

  it('delete special legal contact - PEC', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/LEGAL/${specialLegalAddresses[0].senderId}/PEC`).reply(200);
    // render component
    const { getAllByTestId, getByRole } = render(
      <SpecialContacts addressType={AddressType.LEGAL} />,
      {
        preloadedState: { contactsState: { digitalAddresses: specialLegalAddresses } },
      }
    );
    // ATTENTION: the order in the mock is very important
    const specialContactForms = getAllByTestId(/^[a-zA-Z0-9-]+(?:_pecContact|_sercq_sendContact)$/);
    const deleteButton = within(specialContactForms[0]).getByRole('button', {
      name: 'button.elimina',
    });
    fireEvent.click(deleteButton);
    const dialogBox = getByRole('dialog');
    expect(dialogBox).toBeVisible();
    const deleteTitle = within(dialogBox).getByText('special-contacts.remove-special-title');
    expect(deleteTitle).toBeInTheDocument();
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    const addresses = specialLegalAddresses.slice(1);
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecContact|_sercq_sendContact)$/
      );
      expect(specialContactForms).toHaveLength(specialLegalAddresses.length - 1);
    });
  });

  it('delete special legal contact - SERCQ', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    const sercqSpecial = {
      ...specialLegalAddresses[0],
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    const initialAddresses = [sercqSpecial, ...specialLegalAddresses.slice(1)];

    mock.onDelete(`/bff/v1/addresses/LEGAL/${sercqSpecial.senderId}/SERCQ_SEND`).reply(200);

    // render component
    const { getAllByTestId, getByRole } = render(
      <SpecialContacts addressType={AddressType.LEGAL} />,
      {
        preloadedState: { contactsState: { digitalAddresses: initialAddresses } },
      }
    );

    // ATTENTION: the order in the mock is very important
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    const deleteButton = within(specialContactForms[0]).getByRole('button', {
      name: 'button.disable',
    });
    fireEvent.click(deleteButton);
    const dialogBox = getByRole('dialog');
    expect(dialogBox).toBeVisible();

    const deleteTitle = within(dialogBox).getByText('legal-contacts.remove-sercq_send-title');
    expect(deleteTitle).toBeInTheDocument();

    const confirmButton = within(dialogBox).getByRole('button', {
      name: 'legal-contacts.remove-sercq_send-confirm',
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
      expect(mock.history.delete[0].url).toBe(
        `/bff/v1/addresses/LEGAL/${sercqSpecial.senderId}/SERCQ_SEND`
      );
    });

    const addresses = initialAddresses.slice(1);
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);

    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
      );
      expect(specialContactForms).toHaveLength(specialLegalAddresses.length - 1);
    });
  });

  it('should show existing modal when adding a new contact that already exists', async () => {
    const pecValue = 'already-exist@pec.it';

    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const result = render(<SpecialContacts addressType={AddressType.LEGAL} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.LEGAL,
              value: pecValue,
              channelType: ChannelType.PEC,
              pecValid: true,
              codeValid: true,
              senderId: 'default',
            },
            ...specialLegalAddresses,
          ],
        },
      },
    });
    const specialContactForms = result.getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    const editButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(editButton);

    await testInput(specialContactForms[1], `${specialLegalAddresses[1].senderId}_pec`, pecValue);

    const confirmButton = within(specialContactForms[1]).getByText('button.conferma');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });

    const dialog = result.getByTestId('confirmationDialog');
    expect(dialog).toBeInTheDocument();
    const closeButton = within(dialog).getByRole('button', { name: 'button.annulla' });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('renders component - with courtesy contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    const { getAllByTestId, getByTestId, getAllByText } = render(
      <SpecialContacts addressType={AddressType.COURTESY} />,
      {
        preloadedState: { contactsState: { digitalAddresses: specialCourtesyAddresses } },
      }
    );

    const specialContactsCard = getByTestId('specialContacts');
    expect(specialContactsCard).toBeInTheDocument();
    const cardTitle = within(specialContactsCard).getByText('special-contacts.card-title');
    expect(cardTitle).toBeInTheDocument();
    // contacts list
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_emailSpecialContact|_smsSpecialContact)$/
    );
    expect(specialContactForms).toHaveLength(specialCourtesyAddresses.length);
    specialCourtesyAddresses.forEach((addr) => {
      expect(getAllByText(addr.senderName!)).toHaveLength(1);
      const addressItem = getByTestId(
        `${addr.senderId}_${addr.channelType.toLowerCase()}SpecialContact`
      );
      expect(addressItem).toBeInTheDocument();

      expect(addressItem).toHaveTextContent(addr.value);
      const editButton = within(addressItem).queryByText('button.modifica');
      expect(editButton).not.toBeInTheDocument();
      const deleteButton = within(addressItem).queryByText('button.elimina');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  it('delete special courtesy contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onDelete(`/bff/v1/addresses/COURTESY/${specialCourtesyAddresses[0].senderId}/EMAIL`)
      .reply(200);
    // render component
    const { getAllByTestId, getByRole } = render(
      <SpecialContacts addressType={AddressType.COURTESY} />,
      {
        preloadedState: { contactsState: { digitalAddresses: specialCourtesyAddresses } },
      }
    );
    // ATTENTION: the order in the mock is very important
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_emailSpecialContact|_smsSpecialContact)$/
    );
    const deleteButton = within(specialContactForms[0]).getByRole('button', {
      name: 'button.elimina',
    });
    fireEvent.click(deleteButton);
    const dialogBox = getByRole('dialog');
    expect(dialogBox).toBeVisible();
    const deleteTitle = within(dialogBox).getByText('special-contacts.remove-special-title');
    expect(deleteTitle).toBeInTheDocument();
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    const addresses = specialCourtesyAddresses.slice(1);
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_emailSpecialContact|_smsSpecialContact)$/
      );
      expect(specialContactForms).toHaveLength(specialCourtesyAddresses.length - 1);
    });
  });
});
