import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import {
  testAutocomplete,
  testFormElements,
  testInput,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { COURTESY_CONTACT, LEGAL_CONTACT } from '../../../api/contacts/contacts.routes';
import { GET_ALL_ACTIVATED_PARTIES } from '../../../api/external-registries/external-registries-routes';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { CONTACT_ACTIONS } from '../../../redux/contact/actions';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContacts from '../SpecialContacts';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const specialAddressesCount = digitalAddresses.legal
  .concat(digitalAddresses.courtesy)
  .reduce((count, elem) => {
    if (elem.senderId !== 'default') {
      count++;
    }
    return count;
  }, 0);

function testValidFiled(form: HTMLFormElement, elementName: string) {
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).not.toBeInTheDocument();
  const button = within(form!).getByTestId('addSpecialButton');
  expect(button).toBeEnabled();
}

function testInvalidField(form: HTMLFormElement, elementName: string, errorMessageString: string) {
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveTextContent(errorMessageString);
  const button = within(form!).getByTestId('addSpecialButton');
  expect(button).toBeDisabled();
}

const fillCodeDialog = async (result: RenderResult) => {
  const dialog = await waitFor(() => result.getByTestId('codeDialog'));
  expect(dialog).toBeInTheDocument();
  const codeInputs = dialog?.querySelectorAll('input');
  // fill inputs with values
  codeInputs?.forEach((codeInput, index) => {
    fireEvent.change(codeInput, { target: { value: index.toString() } });
  });
  // confirm the addition
  const dialogButtons = dialog?.querySelectorAll('button');
  fireEvent.click(dialogButtons![1]);
  return dialog;
};

describe('SpecialContacts Component', () => {
  let result: RenderResult | undefined;
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

  it('renders component', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    expect(result?.container).toHaveTextContent('special-contacts.subtitle');
    const form = result?.container.querySelector('form');
    testFormElements(form!, 'sender', 'special-contacts.sender');
    testFormElements(form!, 'addressType', 'special-contacts.address-type');
    testFormElements(form!, 's_pec', 'special-contacts.pec');
    const button = within(form!).getByTestId('addSpecialButton');
    expect(button).toHaveTextContent('button.associa');
    expect(button).toBeDisabled();
    // contacts list
    const specialContactForms = result?.getAllByTestId('specialContactForm');
    expect(specialContactForms).toHaveLength(specialAddressesCount);
  });

  it('check valid pec', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change pec
    await testInput(form!, 's_pec', 'pec-carino@valida.com');
    // check if valid
    testValidFiled(form!, 's_pec');
    // check already exists alert
    const alreadyExistsAlert = result?.getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.pec-already-exists');
  });

  it('check invalid pec', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change pec
    await testInput(form!, 's_pec', 'pec-errata');
    // check if invalid
    testInvalidField(form!, 's_pec', 'legal-contacts.valid-pec');
    // change pec
    await testInput(form!, 's_pec', '');
    // check if invalid
    testInvalidField(form!, 's_pec', 'legal-contacts.valid-pec');
  });

  it('checks invalid mail', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: LegalChannelType.PEC },
        { label: 'special-contacts.mail', value: CourtesyChannelType.EMAIL },
        { label: 'special-contacts.phone', value: CourtesyChannelType.SMS },
      ],
      1
    );
    // change email
    await testInput(form!, 's_mail', 'due__trattini_bassi_no@pagopa.it');
    // check if invalid
    testInvalidField(form!, 's_mail', 'courtesy-contacts.valid-email');
    // change email
    await testInput(form!, 's_mail', '');
    // check if invalid
    testInvalidField(form!, 's_mail', 'courtesy-contacts.valid-email');
  });

  it('checks valid mail', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 0, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: LegalChannelType.PEC },
        { label: 'special-contacts.mail', value: CourtesyChannelType.EMAIL },
        { label: 'special-contacts.phone', value: CourtesyChannelType.SMS },
      ],
      1
    );
    // change email
    await testInput(form!, 's_mail', 'mail@valida.ar');
    // check if valid
    testValidFiled(form!, 's_mail');
    // check already exists alert
    const alreadyExistsAlert = result?.getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.email-already-exists');
  });

  it('checks invalid phone', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: LegalChannelType.PEC },
        { label: 'special-contacts.mail', value: CourtesyChannelType.EMAIL },
        { label: 'special-contacts.phone', value: CourtesyChannelType.SMS },
      ],
      2
    );
    // change phone
    await testInput(form!, 's_phone', '123456789');
    // check if invalid
    testInvalidField(form!, 's_phone', 'courtesy-contacts.valid-phone');
    // change phone
    await testInput(form!, 's_phone', '');
    // check if invalid
    testInvalidField(form!, 's_phone', 'courtesy-contacts.valid-phone');
  });

  it('checks valid phone', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 1, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: LegalChannelType.PEC },
        { label: 'special-contacts.mail', value: CourtesyChannelType.EMAIL },
        { label: 'special-contacts.phone', value: CourtesyChannelType.SMS },
      ],
      2
    );
    // change phone
    await testInput(form!, 's_phone', '3494568016');
    // check if valid
    testValidFiled(form!, 's_phone');
    // check already exists alert
    const alreadyExistsAlert = result?.getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toHaveTextContent('special-contacts.phone-already-exists');
  });

  it('add special contact', async () => {
    const pecValue = 'pec-carino@valida.com';
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    mock
      .onPost(LEGAL_CONTACT(parties[2].id, LegalChannelType.PEC), {
        value: pecValue,
      })
      .reply(200);
    mock
      .onPost(LEGAL_CONTACT(parties[2].id, LegalChannelType.PEC), {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>,
        { preloadedState: { contactsState: { digitalAddresses } } }
      );
    });
    const form = result?.container.querySelector('form');
    // change sender
    await testAutocomplete(form!, 'sender', parties, true, 2, true);
    // change addressType
    await testSelect(
      form!,
      'addressType',
      [
        { label: 'special-contacts.pec', value: LegalChannelType.PEC },
        { label: 'special-contacts.mail', value: CourtesyChannelType.EMAIL },
        { label: 'special-contacts.phone', value: CourtesyChannelType.SMS },
      ],
      0
    );
    // change pec
    await testInput(form!, 's_pec', pecValue);
    const button = within(form!).getByTestId('addSpecialButton');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
    const dialog = await fillCodeDialog(result!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    const addresses = {
      legal: [
        ...digitalAddresses.legal,
        {
          senderName: parties[2].name,
          value: pecValue,
          pecValid: true,
          recipientId: digitalAddresses.legal[0].recipientId,
          senderId: parties[2].id,
          addressType: 'legal',
          channelType: LegalChannelType.PEC,
        },
      ],
      courtesy: digitalAddresses.courtesy,
    };
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    result?.rerender(
      <DigitalContactsCodeVerificationProvider>
        <SpecialContacts
          recipientId={digitalAddresses.legal[0].recipientId}
          legalAddresses={addresses.legal}
          courtesyAddresses={addresses.courtesy}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      // contacts list
      const specialContactForms = result?.getAllByTestId('specialContactForm');
      expect(specialContactForms).toHaveLength(specialAddressesCount + 1);
    });
  });

  it('edit special contact', async () => {
    const mailValue = 'pec-carino@valida.com';
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    mock
      .onPost(COURTESY_CONTACT(parties[0].id, CourtesyChannelType.EMAIL), {
        value: mailValue,
      })
      .reply(200);
    mock
      .onPost(COURTESY_CONTACT(parties[0].id, CourtesyChannelType.EMAIL), {
        value: mailValue,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>,
        { preloadedState: { contactsState: { digitalAddresses } } }
      );
    });
    // ATTENTION: the order in the mock is very important
    // change mail
    const specialContactForms = result?.getAllByTestId('specialContactForm');
    const emailEditButton = within(specialContactForms![1]).getByRole('button', {
      name: 'button.modifica',
    });
    fireEvent.click(emailEditButton);
    const input = await waitFor(() => specialContactForms![1].querySelector('input'));
    fireEvent.change(input!, { target: { value: mailValue } });
    const emailSaveButton = within(specialContactForms![1]).getByRole('button', {
      name: 'button.salva',
    });
    fireEvent.click(emailSaveButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mailValue,
      });
    });
    const dialog = await fillCodeDialog(result!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: mailValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    const addresses = {
      legal: digitalAddresses.legal,
      courtesy: [
        { ...digitalAddresses.courtesy[0], value: mailValue, senderName: parties[0].id },
        ...digitalAddresses.courtesy.slice(1),
      ],
    };
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    expect(input).not.toBeInTheDocument();
    // simulate rerendering due to redux changes
    result?.rerender(
      <DigitalContactsCodeVerificationProvider>
        <SpecialContacts
          recipientId={digitalAddresses.legal[0].recipientId}
          legalAddresses={addresses.legal}
          courtesyAddresses={addresses.courtesy}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      // contacts list
      const specialContactForms = result?.getAllByTestId('specialContactForm');
      expect(specialContactForms![1]).toHaveTextContent(mailValue);
    });
  });

  it('delete special contact', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    mock.onDelete(COURTESY_CONTACT(parties[0].id, CourtesyChannelType.EMAIL)).reply(200);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId={digitalAddresses.legal[0].recipientId}
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>,
        { preloadedState: { contactsState: { digitalAddresses } } }
      );
    });
    // ATTENTION: the order in the mock is very important
    // delete mail
    const specialContactForms = result?.getAllByTestId('specialContactForm');
    const emailDeleteButton = within(specialContactForms![1]).getByRole('button', {
      name: 'button.elimina',
    });
    fireEvent.click(emailDeleteButton);
    const dialogBox = result?.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
    expect(dialogBox).toBeVisible();
    const confirmButton = within(dialogBox!).getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    const addresses = {
      legal: digitalAddresses.legal,
      courtesy: [...digitalAddresses.courtesy.slice(1)],
    };
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    result?.rerender(
      <DigitalContactsCodeVerificationProvider>
        <SpecialContacts
          recipientId={digitalAddresses.legal[0].recipientId}
          legalAddresses={addresses.legal}
          courtesyAddresses={addresses.courtesy}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      // contacts list
      const specialContactForms = result?.getAllByTestId('specialContactForm');
      expect(specialContactForms).toHaveLength(specialAddressesCount - 1);
    });
  });

  it('API error', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <DigitalContactsCodeVerificationProvider>
            <SpecialContacts
              recipientId={digitalAddresses.legal[0].recipientId}
              legalAddresses={digitalAddresses.legal}
              courtesyAddresses={digitalAddresses.courtesy}
            />
          </DigitalContactsCodeVerificationProvider>
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
