import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  getById,
  testAutocomplete,
  testInput,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  digitalAddresses,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContacts from '../SpecialContacts';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const specialAddresses = digitalAddresses.filter((addr) => addr.senderId !== 'default');

// TODO: questi test andranno rivisti una volta che saranno disponibili le api bulk
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

  it('renders component - no contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container } = render(<SpecialContacts />);
    expect(container).toHaveTextContent(`special-contacts.title`);
    const button = within(container).getByTestId('addSpecialContactButton');
    expect(button).toHaveTextContent(`special-contacts.add-contact`);
  });

  // it.only('renders component - with contacts', () => {
  //   mock.onGet('/bff/v1/pa-list').reply(200, parties);

  //   // render component
  //   const { container, getAllByTestId } = render(<SpecialContacts />, {
  //     preloadedState: { contactsState: { digitalAddresses } },
  //   });
  //   expect(container).toHaveTextContent(`special-contacts.title`);
  //   const button = within(container).getByTestId('addSpecialContactButton');
  //   expect(button).toHaveTextContent(`special-contacts.add-contact`);
  //   // contacts list
  //   const specialContactForms = getAllByTestId(
  //     /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
  //   );
  //   expect(specialContactForms).toHaveLength(specialAddresses.length);
  //   specialContactForms.forEach((contactField, index) => {
  //     expect(contactField).toHaveTextContent(specialAddresses[index].value);

  //     const editButton = within(contactField).getByText('button.modifica');
  //     expect(editButton).toBeInTheDocument();

  //     const deleteButton = within(contactField).getByText('button.elimina');
  //     expect(deleteButton).toBeInTheDocument();
  //   });
  // });

  it('add special contact', async () => {
    const pecValue = 'pec-carino@valida.com';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, {
        value: pecValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    const addButton = within(result.container).getByTestId('addSpecialContactButton');
    fireEvent.click(addButton);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();

    // change sender
    await testAutocomplete(addSpecialContactDialog!, 'sender', parties, true, 2, true);
    // change addressType
    await testSelect(
      addSpecialContactDialog!,
      'channelType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      0
    );
    // change pec
    await testInput(addSpecialContactDialog!, 's_value', pecValue);

    const confirmButton = within(addSpecialContactDialog).getByText('button.associa');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
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
      ...digitalAddresses,
      {
        senderName: parties[2].name,
        value: pecValue,
        pecValid: true,
        senderId: parties[2].id,
        addressType: AddressType.LEGAL,
        channelType: ChannelType.PEC,
        codeValid: true,
      },
    ];

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    result.rerender(<SpecialContacts />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length + 1);
    });
  });

  it('edit special contact', async () => {
    const mailValue = 'pec-carino@valida.com';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[0].id}/EMAIL`, {
        value: mailValue,
      })
      .replyOnce(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`bff/v1/addresses/COURTESY/${parties[0].id}/EMAIL`, {
        value: mailValue,
        verificationCode: '01234',
      })
      .replyOnce(204);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    // ATTENTION: the order in the mock is very important
    // change mail
    const specialContactForms = result.getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    const emailEditButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(emailEditButton);

    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();

    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input!, { target: { value: mailValue } });
    const senderInput = getById(addSpecialContactDialog, 'sender');
    expect(senderInput).toBeDisabled();
    const associaButton = within(addSpecialContactDialog).getByText('button.associa');
    fireEvent.click(associaButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mailValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: mailValue,
        verificationCode: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const addresses = [
      ...digitalLegalAddresses,
      {
        ...digitalCourtesyAddresses[0],
        senderName: parties[0].name,
        value: mailValue,
      },
      ...digitalCourtesyAddresses.slice(1),
    ];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    expect(input).not.toBeInTheDocument();
    // simulate rerendering due to redux changes
    result.rerender(<SpecialContacts />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
      );
      expect(specialContactForms[1]).toHaveTextContent(mailValue);
    });
  });

  it('delete special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/COURTESY/${parties[0].id}/EMAIL`).reply(200);
    // render component
    const { rerender, getAllByTestId, getByRole } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    // ATTENTION: the order in the mock is very important
    // delete mail
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    const emailDeleteButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.elimina',
    });
    fireEvent.click(emailDeleteButton);
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
    const addresses = [...digitalLegalAddresses, ...digitalCourtesyAddresses.slice(1)];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    rerender(<SpecialContacts />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length - 1);
    });
  });

  it('should show existing modal when adding a new contact that already exists', async () => {
    const mailValue = digitalCourtesyAddresses.filter(
      (addr) => addr.channelType === ChannelType.EMAIL
    )[0].value;

    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[0].id}/EMAIL`, { value: mailValue })
      .reply(409);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    const addButton = within(result.container).getByTestId('addSpecialContactButton');
    fireEvent.click(addButton);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();

    // change sender
    await testAutocomplete(addSpecialContactDialog!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      addSpecialContactDialog!,
      'channelType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      1
    );
    // change mail
    await testInput(addSpecialContactDialog!, 's_value', mailValue);

    const confirmButton = within(addSpecialContactDialog).getByText('button.associa');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });

    const dialog = result.getByTestId('duplicateDialog');
    expect(dialog).toBeInTheDocument();
    const closeButton = within(dialog).getByRole('button', { name: 'button.annulla' });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
