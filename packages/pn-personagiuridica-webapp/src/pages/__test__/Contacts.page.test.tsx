import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import {
  digitalAddresses,
  digitalAddressesPecValidation,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../__mocks__/Contacts.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { RenderResult, act, render, screen, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CONTACT_ACTIONS } from '../../redux/contact/actions';
import Contacts from '../Contacts.page';

const mockOpenFn = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('Contacts page', async () => {
  let mock: MockAdapter;
  let result: RenderResult;
  const original = window.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.resetAllMocks();
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('renders Contacts (no contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    await act(async () => {
      result = await render(<Contacts />);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/addresses');
  });

  it('renders Contacts (legal contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalLegalAddresses);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Contacts (courtesy contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalCourtesyAddresses);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Special Contact having Sercq enabled and pec in validation', async () => {
    mock
      .onGet('/bff/v1/addresses')
      .reply(200, [
        ...digitalAddressesPecValidation(true, true),
        ...digitalAddressesPecValidation(true, false, { id: '1234', name: '1234' }),
      ]);
    await act(async () => {
      result = render(<Contacts />);
    });

    const banner = result.getByTestId('PecVerificationAlert');
    expect(banner).toBeInTheDocument();
    const alertIcon = within(banner).getByTestId('InfoOutlinedIcon');
    expect(alertIcon).toBeInTheDocument();
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.title');
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.dod-enabled-message');

    const specialContacts = result.getByTestId('specialContacts');
    expect(specialContacts).toBeInTheDocument();
    // check contacts
    const pecValidationItem = within(specialContacts).getByTestId('1234_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = within(specialContacts).getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = within(specialContacts).getByText(
      'legal-contacts.cancel-pec-validation'
    );
    expect(cancelValidationButton).toBeInTheDocument();

    const sercqSendContact = within(specialContacts).getByTestId('1234_sercq_sendSpecialContact');
    expect(sercqSendContact).toBeInTheDocument();
    expect(sercqSendContact).toHaveTextContent('special-contacts.sercq_send');

    const disableButton = within(sercqSendContact).getByRole('button', { name: 'button.disable' });
    expect(disableButton).toBeInTheDocument();
    expect(disableButton).toBeDisabled();
  });

  it('API error', async () => {
    mock.onGet('/bff/v1/addresses').reply(errorMock.status, errorMock.data);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Contacts />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
