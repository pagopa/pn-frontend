import {
  AppResponseMessage,
  ResponseEventDispatcher,
  apiOutcomeTestHelper,
} from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import * as redux from 'react-redux';
import { courtesyAddresses, initialState, legalAddresses } from '../../../__mocks__/SpecialContacts.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { GET_ALL_ACTIVATED_PARTIES } from '../../../api/external-registries/external-registries-routes';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import * as actions from '../../../redux/contact/actions';
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

/**
 * Vedi commenti nella definizione di simpleMockForApiErrorWrapper
 */
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
  };
});

jest.mock('../SpecialContactElem', () => () => <div>SpecialContactElem</div>);

function testFormElements(form: HTMLFormElement, elementName: string, label: string) {
  const formElement = form.querySelector(`input[name="${elementName}"]`);
  expect(formElement).toBeInTheDocument();
  const formElementLabel = form.querySelector(`label[for="${elementName}"]`);
  expect(formElementLabel).toBeInTheDocument();
  expect(formElementLabel).toHaveTextContent(label);
}

async function testSelect(
  form: HTMLFormElement,
  elementName: string,
  options: Array<{ label: string; value: string }>,
  optToSelect: number
) {
  const selectInput = form.querySelector(`input[name="${elementName}"]`);
  const selectButton = form.querySelector(`div[id="${elementName}"]`);
  fireEvent.mouseDown(selectButton!);
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
  });
  await waitFor(() => {
    fireEvent.click(selectOptionsListItems[optToSelect]);
    expect(selectInput).toHaveValue(options[optToSelect].value);
  });
}

async function testAutocomplete(
  form: HTMLFormElement,
  elementName: string,
  options: Array<{ label: string; value: string }>,
  optToSelect: number
) {
  const selectInput = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.mouseDown(selectInput as Element);
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsContainer).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
  });
  await waitFor(() => {
    fireEvent.click(selectOptionsListItems[optToSelect]);
    expect(selectInput).toHaveValue(options[optToSelect].label);
  });
}

async function testInvalidField(
  form: HTMLFormElement,
  elementName: string,
  value: string,
  errorMessageString: string
) {
  await testAutocomplete(
    form,
    'sender',
    [
      { label: 'Comune di Milano', value: 'comune-milano' },
      { label: 'Tribunale di Milano', value: 'tribunale-milano' },
    ],
    0
  );
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => expect(input!).toHaveValue(value));
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveTextContent(errorMessageString);
  const button = form.querySelector('button[data-testid="Special contact add button"]');
  expect(button).toBeDisabled();
}

async function testValidFiled(form: HTMLFormElement, elementName: string, value: string) {
  await testAutocomplete(
    form,
    'sender',
    [
      { label: 'Comune di Milano', value: 'comune-milano' },
      { label: 'Tribunale di Milano', value: 'tribunale-milano' },
    ],
    0
  );
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => expect(input!).toHaveValue(value));
  const errorMessage = form.querySelector(`#${elementName}-helper-text`);
  expect(errorMessage).not.toBeInTheDocument();
  const button = form.querySelector('button[data-testid="Special contact add button"]');
  expect(button).toBeEnabled();
}

async function testContactAddition(
  form: HTMLFormElement,
  elementName: string,
  value: string,
  mockDispatchFn: jest.Mock,
  mockActionFn: jest.Mock,
  channelType: LegalChannelType | CourtesyChannelType
) {
  if (channelType === LegalChannelType.PEC) {
    const actionSpy = jest.spyOn(actions, 'createOrUpdateLegalAddress');
    actionSpy.mockImplementation(mockActionFn as any);
  } else {
    const actionSpy = jest.spyOn(actions, 'createOrUpdateCourtesyAddress');
    actionSpy.mockImplementation(mockActionFn as any);
  }
  await testAutocomplete(
    form,
    'sender',
    [
      { label: 'Comune di Milano', value: 'comune-milano' },
      { label: 'Tribunale di Milano', value: 'tribunale-milano' },
    ],
    0
  );
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => expect(input!).toHaveValue(value));
  const button = form.querySelector('button[data-testid="Special contact add button"]');
  fireEvent.click(button!);
  mockDispatchFn.mockClear();
  await waitFor(() => {
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      recipientId: 'mocked-recipientId',
      senderId: 'comune-milano',
      senderName: 'Comune di Milano',
      channelType,
      value: elementName === 's_phone' ? '+39' + value : value,
      code: undefined,
    });
  });

  const dialog = await waitFor(() => {
    const dialogEl = screen.queryByTestId('codeDialog');
    expect(dialogEl).toBeInTheDocument();
    return dialogEl;
  });
  const codeInputs = dialog?.querySelectorAll('input');
  // fill inputs with values
  codeInputs?.forEach((codeInput, index) => {
    fireEvent.change(codeInput, { target: { value: index.toString() } });
  });
  const dialogButtons = dialog?.querySelectorAll('button');
  // clear mocks
  mockActionFn.mockClear();
  mockActionFn.mockReset();
  mockDispatchFn.mockReset();
  mockDispatchFn.mockClear();
  mockDispatchFn.mockImplementation(
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ code: 'verified' }),
    }))
  );
  fireEvent.click(dialogButtons![1]);
  await waitFor(() => {
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      recipientId: 'mocked-recipientId',
      senderId: 'comune-milano',
      senderName: 'Comune di Milano',
      channelType,
      value: elementName === 's_phone' ? '+39' + value : value,
      code: '01234',
    });
  });
  await waitFor(() => {
    expect(dialog).not.toBeInTheDocument();
  });
  // clear mocks - again
  mockDispatchFn.mockReset();
  mockDispatchFn.mockClear();
}

describe('SpecialContacts Component - assuming parties API works properly', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;

  beforeEach(async () => {
    // mock action
    mockActionFn = jest.fn();
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId="mocked-recipientId"
            legalAddresses={legalAddresses}
            courtesyAddresses={courtesyAddresses}
          />
        </DigitalContactsCodeVerificationProvider>,
        { preloadedState: initialState }
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    // restore sembra di essere appunto necessario per restituire il comportamento originale
    // alle funzoni/oggetti moccati
    // ------------------
    // Carlos Lombardi, 2022.09.01
    jest.restoreAllMocks();
  });

  it('renders SpecialContacts', () => {
    expect(result.container).toHaveTextContent('special-contacts.subtitle');
    const form = result.container.querySelector('form');
    testFormElements(form!, 'sender', 'special-contacts.sender');
    testFormElements(form!, 'addressType', 'special-contacts.address-type');
    testFormElements(form!, 's_pec', 'special-contacts.pec');
    const button = form?.querySelector('[data-testid="Special contact add button"]');
    expect(button).toHaveTextContent('button.associa');
    expect(button).toBeDisabled();
  });

  it('changes sender', async () => {
    const form = result.container.querySelector('form');
    await testAutocomplete(
      form!,
      'sender',
      [
        { label: 'Comune di Milano', value: 'comune-milano' },
        { label: 'Tribunale di Milano', value: 'tribunale-milano' },
      ],
      1
    );
  });

  it('changes addressType', async () => {
    const form = result.container.querySelector('form');
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
    const pecInput = form?.querySelector(`input[name="s_pec"]`);
    expect(pecInput).not.toBeInTheDocument();
    testFormElements(form!, 's_mail', 'special-contacts.mail');
  });

  it('checks invalid pec - 1', async () => {
    const form = result.container.querySelector('form');
    await testInvalidField(form!, 's_pec', 'mail-errata', 'legal-contacts.valid-pec');
  });

  it('checks invalid pec - 2', async () => {
    const form = result.container.querySelector('form');
    await testInvalidField(
      form!,
      's_pec',
      'non.va.bene@a1.a2.a3.a4.a5.a6.a7.a8.a9.a0.b1.b2.b3.b4',
      'legal-contacts.valid-pec'
    );
  });

  it('checks valid pec', async () => {
    const form = result.container.querySelector('form');
    await testValidFiled(form!, 's_pec', 'mail-carino@valida.com');
  });

  it('checks invalid mail', async () => {
    const form = result.container.querySelector('form');
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
    await testInvalidField(
      form!,
      's_mail',
      'due__trattini_bassi_no@pagopa.it',
      'courtesy-contacts.valid-email'
    );
  });

  it('checks valid mail', async () => {
    const form = result.container.querySelector('form');
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
    await testValidFiled(form!, 's_mail', 'mail@valida.ar');
  });

  it('checks invalid phone', async () => {
    const form = result.container.querySelector('form');
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
    await testInvalidField(form!, 's_phone', 'telefono-errato', 'courtesy-contacts.valid-phone');
  });

  it('checks valid phone', async () => {
    const form = result.container.querySelector('form');
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
    await testValidFiled(form!, 's_phone', '3494568016');
  });

  it('adds pec', async () => {
    const form = result.container.querySelector('form');
    await testContactAddition(
      form!,
      's_pec',
      'mail@valida.ar',
      mockDispatchFn,
      mockActionFn,
      LegalChannelType.PEC
    );
  });

  it('adds phone', async () => {
    const form = result.container.querySelector('form');
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
    await testContactAddition(
      form!,
      's_phone',
      '3494568016',
      mockDispatchFn,
      mockActionFn,
      CourtesyChannelType.SMS
    );
  });

  it('adds email', async () => {
    const form = result.container.querySelector('form');
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
    await testContactAddition(
      form!,
      's_mail',
      'mail-trattino.punto_underscore.fine@val-ida.it',
      mockDispatchFn,
      mockActionFn,
      CourtesyChannelType.EMAIL
    );
  });
});

describe('Contacts Page - different contact API behaviors', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    apiOutcomeTestHelper.clearMock();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('API error', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES(undefined)).reply(500, {
      response: { status: 500 },
    });
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <DigitalContactsCodeVerificationProvider>
              <SpecialContacts recipientId="toto" legalAddresses={[]} courtesyAddresses={[]} />
            </DigitalContactsCodeVerificationProvider>
          </>
        )
    );
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES(undefined)).reply(200, []);
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <DigitalContactsCodeVerificationProvider>
              <SpecialContacts recipientId="toto" legalAddresses={[]} courtesyAddresses={[]} />
            </DigitalContactsCodeVerificationProvider>
          </>
        )
    );
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
