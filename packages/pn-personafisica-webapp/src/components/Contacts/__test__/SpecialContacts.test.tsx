import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import SpecialContacts from '../SpecialContacts';
import { fillCodeDialog } from './test-utils';

const defaultAddress = digitalLegalAddresses.find((addr) => addr.senderId === 'default');
const specialAddresses = digitalLegalAddresses.filter((addr) => addr.senderId !== 'default');

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

    const { getAllByTestId, getByTestId } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });

    const specialContactsCard = getByTestId('specialContacts');
    expect(specialContactsCard).toBeInTheDocument();
    const cardTitle = within(specialContactsCard).getByText('special-contacts.card-title');
    expect(cardTitle).toBeInTheDocument();
    // contacts list
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    expect(specialContactForms).toHaveLength(specialAddresses.length);
    specialAddresses.forEach((addr) => {
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
      .onPost(`/bff/v1/addresses/LEGAL/${specialAddresses[0].senderId}/PEC`, {
        value: pecValue,
      })
      .replyOnce(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`bff/v1/addresses/LEGAL/${specialAddresses[0].senderId}/PEC`, {
        value: pecValue,
        verificationCode: '01234',
      })
      .replyOnce(204);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
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
      defaultAddress,
      {
        ...specialAddresses[0],
        senderName: parties[0].name,
        value: pecValue,
      },
      ...specialAddresses.slice(1),
    ];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    expect(input).not.toBeInTheDocument();
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
      );
      expect(specialContactForms[0]).toHaveTextContent(pecValue);
    });
  });

  it('delete special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/LEGAL/${specialAddresses[0].senderId}/PEC`).reply(200);
    // render component
    const { getAllByTestId, getByRole } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });
    // ATTENTION: the order in the mock is very important
    // delete mail
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
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
    const addresses = [defaultAddress, ...specialAddresses.slice(1)];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length - 1);
    });
  });

  it('should show existing modal when edit a contact with a value that already exists', async () => {
    const pecValue = defaultAddress!.value;

    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });
    const specialContactForms = result.getAllByTestId(
      /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    );
    const editButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(editButton);

    await testInput(specialContactForms[1], `${specialAddresses[1].senderId}_pec`, pecValue);

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
});
