import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import {
  digitalAddresses,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../__mocks__/Contacts.mock';
import { RenderResult, act, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { ChannelType } from '../../models/contacts';
import { CONTACT_ACTIONS } from '../../redux/contact/actions';
import Contacts from '../Contacts.page';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe.skip('Contacts page', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.resetAllMocks();
  });

  it('renders Contacts (no contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    await act(async () => {
      result = render(<Contacts />);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const specialContact = result.queryByTestId('specialContact');
    expect(specialContact).not.toBeInTheDocument();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/addresses');
  });

  it('renders Contacts (AppIO)', async () => {
    const appIO = digitalCourtesyAddresses.find((addr) => addr.channelType === ChannelType.IOMSG);
    mock.onGet('/bff/v1/addresses').reply(200, [appIO]);
    await act(async () => {
      result = render(<Contacts />);
    });
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const specialContact = result.queryByTestId('specialContact');
    expect(specialContact).not.toBeInTheDocument();
  });

  it('renders Contacts (legal contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalLegalAddresses);
    await act(async () => {
      result = render(<Contacts />);
    });
    const legalContacts = result.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const specialContact = result.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy contacts)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalCourtesyAddresses);
    await act(async () => {
      result = render(<Contacts />);
    });
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const specialContact = result.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    await act(async () => {
      result = render(<Contacts />);
    });
    const legalContacts = result.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const specialContact = result.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('API error', async () => {
    mock.onGet('/bff/v1/addresses').reply(500);
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
