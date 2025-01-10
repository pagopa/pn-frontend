import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, IAppMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import {
  digitalAddresses,
  digitalAddressesPecValidation,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../__mocks__/Contacts.mock';
import { RenderResult, act, render, screen, within } from '../../__test__/test-utils';
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

describe('Contacts page', async () => {
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
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: [],
          },
        },
      });
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);
  });

  it('renders Contacts (AppIO)', async () => {
    const appIO = digitalCourtesyAddresses.find((addr) => addr.channelType === ChannelType.IOMSG);
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: [appIO],
          },
        },
      });
    });
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Contacts (legal contacts)', async () => {
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalLegalAddresses,
          },
        },
      });
    });
    const legalContacts = result.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Contacts (courtesy contacts)', async () => {
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalCourtesyAddresses,
          },
        },
      });
    });
    const legalContacts = result.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses,
          },
        },
      });
    });
    const legalContacts = result.queryByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const courtesyContacts = result.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
  });

  it('renders Special Contact having Sercq enabled and pec in validation', async () => {
    await act(async () => {
      result = render(<Contacts />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: [
              ...digitalAddressesPecValidation(true, true),
              ...digitalAddressesPecValidation(true, false, { id: '1234', name: '1234' }),
            ],
          },
        },
      });
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
    const errors: Array<IAppMessage> = [
      {
        id: 'mocked-id',
        title: 'Mocked title',
        message: 'Mocked message',
        blocking: false,
        toNotify: true,
        alreadyShown: true,
        action: CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES,
      },
    ];

    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Contacts />
        </>,
        {
          preloadedState: {
            appState: {
              loading: {
                result: false,
              },
              messages: {
                errors,
                success: [],
                info: [],
              },
            },
          },
        }
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
