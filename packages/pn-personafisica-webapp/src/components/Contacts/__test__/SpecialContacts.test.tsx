import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import {
  testAutocomplete,
  testFormElements,
  testInput,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  digitalAddresses,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import {
  act,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { CONTACT_ACTIONS } from '../../../redux/contact/actions';
import SpecialContacts from '../SpecialDigitalContacts';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const specialAddressesCount = digitalAddresses.reduce((count, elem) => {
  if (elem.senderId !== 'default') {
    count++;
  }
  return count;
}, 0);

function testValidFiled(form: HTMLFormElement, elementName: string) {
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).not.toBeInTheDocument();
  const button = within(form).getByTestId('addSpecialButton');
  expect(button).toBeEnabled();
}

function testInvalidField(form: HTMLFormElement, elementName: string, errorMessageString: string) {
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveTextContent(errorMessageString);
  const button = within(form).getByTestId('addSpecialButton');
  expect(button).toBeDisabled();
}

describe.skip('SpecialContacts Component', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContacts digitalAddresses={digitalAddresses} />
    );
    expect(container).toHaveTextContent('special-contacts.subtitle');
    const form = container.querySelector('form');
    testFormElements(form!, 'sender', 'special-contacts.sender');
    testFormElements(form!, 'addressType', 'special-contacts.address-type');
    testFormElements(form!, 's_value', 'special-contacts.pec');
    const button = within(form!).getByTestId('addSpecialButton');
    expect(button).toHaveTextContent('button.associa');
    expect(button).toBeDisabled();
    // contacts list
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(specialAddressesCount);
  });

  it('check valid pec', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId } = render(
      <SpecialContacts digitalAddresses={digitalAddresses} />
    );
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change pec
    await testInput(form!, 's_value', 'pec-carino@valida.com');
    // check if valid
    testValidFiled(form!, 's_value');
    // check already exists alert
    const alreadyExistsAlert = getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.pec-already-exists');
  });

  it('check invalid pec', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container } = render(<SpecialContacts digitalAddresses={digitalAddresses} />);
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change pec
    await testInput(form!, 's_value', 'pec-errata');
    // check if invalid
    testInvalidField(form!, 's_value', 'legal-contacts.valid-pec');
    // change pec
    await testInput(form!, 's_value', '');
    // check if invalid
    testInvalidField(form!, 's_value', 'legal-contacts.valid-pec');
  });

  it('checks invalid mail', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container } = render(<SpecialContacts digitalAddresses={digitalAddresses} />);
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      1
    );
    // change email
    await testInput(form!, 's_value', 'email.non.[valida]@pagopa.it');
    // check if invalid
    testInvalidField(form!, 's_value', 'courtesy-contacts.valid-email');
    // change email
    await testInput(form!, 's_value', '');
    // check if invalid
    testInvalidField(form!, 's_value', 'courtesy-contacts.valid-email');
  });

  it('checks valid mail', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId } = render(
      <SpecialContacts digitalAddresses={digitalAddresses} />
    );
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 0, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      1
    );
    // change email
    await testInput(form!, 's_value', 'mail@valida.ar');
    // check if valid
    testValidFiled(form!, 's_value');
    // check already exists alert
    const alreadyExistsAlert = getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.email-already-exists');
  });

  it('checks invalid phone', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container } = render(<SpecialContacts digitalAddresses={digitalAddresses} />);
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      2
    );
    // change phone
    await testInput(form!, 's_value', '123456789');
    // check if invalid
    testInvalidField(form!, 's_value', 'courtesy-contacts.valid-sms');
    // change phone
    await testInput(form!, 's_value', '');
    // check if invalid
    testInvalidField(form!, 's_value', 'courtesy-contacts.valid-sms');
  });

  it('checks valid phone', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId } = render(
      <SpecialContacts digitalAddresses={digitalAddresses} />
    );
    const form = container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      2
    );
    // change phone
    await testInput(form!, 's_value', '3494568016');
    // check if valid
    testValidFiled(form!, 's_value');
    // check already exists alert
    const alreadyExistsAlert = getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.sms-already-exists');
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
    const result = render(<SpecialContacts digitalAddresses={digitalAddresses} />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    const form = result.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 2, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: ChannelType.PEC },
        { label: 'special-contacts.email', value: ChannelType.EMAIL },
        { label: 'special-contacts.sms', value: ChannelType.SMS },
      ],
      0
    );
    // change pec
    await testInput(form!, 's_value', pecValue);
    const button = within(form!).getByTestId('addSpecialButton');
    fireEvent.click(button);
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
    result.rerender(<SpecialContacts digitalAddresses={addresses} />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddressesCount + 1);
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
    const result = render(<SpecialContacts digitalAddresses={digitalAddresses} />, {
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
    const input = await waitFor(() => specialContactForms[1].querySelector('input'));
    fireEvent.change(input!, { target: { value: mailValue } });
    const emailSaveButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.salva',
    });
    fireEvent.click(emailSaveButton);
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
        senderName: undefined,
        value: mailValue,
      },
      ...digitalCourtesyAddresses.slice(1),
    ];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    expect(input).not.toBeInTheDocument();
    // simulate rerendering due to redux changes
    result.rerender(<SpecialContacts digitalAddresses={addresses} />);
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
    const { rerender, getAllByTestId, getByRole } = render(
      <SpecialContacts digitalAddresses={digitalAddresses} />,
      { preloadedState: { contactsState: { digitalAddresses } } }
    );
    // ATTENTION: the order in the mock is very important
    // delete mail
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    const emailDeleteButton = within(specialContactForms[1]).getByRole('button', {
      name: 'button.elimina',
    });
    fireEvent.click(emailDeleteButton);
    const dialogBox = getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
    expect(dialogBox).toBeVisible();
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    const addresses = [...digitalLegalAddresses, ...digitalCourtesyAddresses.slice(1)];
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    rerender(<SpecialContacts digitalAddresses={addresses} />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = getAllByTestId(
        /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddressesCount - 1);
    });
  });

  it('API error', async () => {
    mock.onGet('/bff/v1/pa-list').reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <SpecialContacts digitalAddresses={digitalAddresses} />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
