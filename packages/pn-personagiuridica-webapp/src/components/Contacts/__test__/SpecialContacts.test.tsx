import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  getById,
  testAutocomplete,
  testInput,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContacts from '../SpecialContacts';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components?.map((c) => c)}
    </>
  ),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const defaultAddress = digitalLegalAddresses.find((addr) => addr.senderId === 'default');
const specialAddresses = digitalLegalAddresses.filter((addr) => addr.senderId !== 'default');

const channelTypesItems = [
  { label: 'special-contacts.pec', value: ChannelType.PEC },
  { label: 'special-contacts.sercq_send', value: ChannelType.SERCQ_SEND },
];

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
    expect(container).toHaveTextContent(`special-contacts.description`);
    const button = within(container).getByTestId('addSpecialContactButton');
    expect(button).toBeInTheDocument();
  });

  it('renders component - with contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    const { container, getAllByTestId, getByTestId } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });
    expect(container).toHaveTextContent(`special-contacts.description`);
    const button = within(container).getByTestId('addSpecialContactButton');
    expect(button).toBeInTheDocument();
    // contacts list
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
    );
    expect(specialContactForms).toHaveLength(specialAddresses.length);
    specialAddresses.forEach((addr) => {
      const addressItem = getByTestId(`${addr.senderId}_${addr.channelType.toLowerCase()}Contact`);
      expect(addressItem).toBeInTheDocument();

      if (addr.channelType === ChannelType.PEC && !addr.pecValid) {
        expect(addressItem).toHaveTextContent('legal-contacts.pec-validating');
        const cancelValidationButton = within(addressItem).getByTestId('cancelValidation');
        expect(cancelValidationButton).toBeInTheDocument();
      } else {
        expect(addressItem).toHaveTextContent(addr.value);
        const editButton = within(addressItem).getByTestId(
          `modifyContact-special_${addr.channelType}`
        );
        expect(editButton).toBeInTheDocument();
        const deleteButton = within(addressItem).getByTestId(
          `cancelContact-special_${addr.channelType}`
        );
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

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
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
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
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );
    // change pec
    await testInput(addSpecialContactDialog!, 's_value', pecValue);

    const confirmButton = within(addSpecialContactDialog).getByText('button.associa');
    fireEvent.click(confirmButton);

    const legalAssociationDialog = await waitFor(() =>
      result.getByTestId('legalContactAssociationDialog')
    );
    expect(legalAssociationDialog).toBeInTheDocument();
    const titleEl = getById(legalAssociationDialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title');
    const bodyEl = getById(legalAssociationDialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description');
    const confirmDialogButton = within(legalAssociationDialog).getByText('button.conferma');
    fireEvent.click(confirmDialogButton);

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
      ...digitalLegalAddresses,
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
        /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length + 1);
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
      /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
    );
    const editButton = within(specialContactForms[0]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(editButton);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input!, { target: { value: pecValue } });
    const senderInput = getById(addSpecialContactDialog, 'sender');
    expect(senderInput).toBeDisabled();
    const associaButton = within(addSpecialContactDialog).getByText('button.associa');
    fireEvent.click(associaButton);
    // confirm the action
    const legalAssociationDialog = await waitFor(() =>
      result.getByTestId('legalContactAssociationDialog')
    );
    expect(legalAssociationDialog).toBeInTheDocument();
    const confirmDialogButton = within(legalAssociationDialog).getByText('button.conferma');
    fireEvent.click(confirmDialogButton);
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
    // simulate rerendering due to redux changes
    result.rerender(<SpecialContacts />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
      );
      expect(specialContactForms[0]).toHaveTextContent(pecValue);
    });
  });

  it('delete special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/LEGAL/${specialAddresses[0].senderId}/PEC`).reply(200);
    // render component
    const { rerender, getAllByTestId, getByRole } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });
    // ATTENTION: the order in the mock is very important
    // delete mail
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
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
    // simulate rerendering due to redux changes
    rerender(<SpecialContacts />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_sercq_sendContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length - 1);
    });
  });

  it('should show existing modal when adding a new contact that already exists', async () => {
    const pecValue = defaultAddress!.value;

    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const result = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
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
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );
    // change pec
    await testInput(addSpecialContactDialog!, 's_value', pecValue);

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

  it('should show special dialog when click on add button of an existing contact', async () => {
    const { container, getByTestId } = render(<SpecialContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });

    const addMoreSpecialContactsButton = within(container).getAllByTestId('addMoreSpecialContacts');
    fireEvent.click(addMoreSpecialContactsButton[0]);

    const addSpecialContactDialog = await waitFor(() => getByTestId('addSpecialContactDialog'));
    expect(addSpecialContactDialog).toBeInTheDocument();
  });
});
