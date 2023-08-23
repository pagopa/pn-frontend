import {
  AppResponseMessage,
  ResponseEventDispatcher,
  apiOutcomeTestHelper,
} from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { act, fireEvent, mockApi, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import { PROFILO } from '../../navigation/routes.const';
import Contacts from '../Contacts.page';
import {
  contactsAppIoOnly,
  contactsCourtesyOnly,
  contactsCourtesyOnlyWithAppIo,
  contactsFull,
  contactsLegalOnly,
} from './Contacts.page.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const mockNavigateFn = jest.fn();
// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
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

jest.mock('../../component/Contacts/InsertLegalContact', () => () => <div>InsertLegalContact</div>);
jest.mock('../../component/Contacts/LegalContactsList', () => () => <div>LegalContactsList</div>);
jest.mock('../../component/Contacts/CourtesyContacts', () => () => <div>CourtesyContacts</div>);
jest.mock('../../component/Contacts/IOContact', () => () => <div>IOContact</div>);
jest.mock('../../component/Contacts/SpecialContacts', () => () => <div>SpecialContacts</div>);

const initialState = {
  preloadedState: {
    userState: {
      user: {
        uid: 'mocked-recipientId',
        organization: {
          name: 'Mocked organization',
        },
      },
    },
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: [],
      },
    },
  },
};

describe('Contacts page - assuming contact API works properly', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it('renders Contacts (no contacts)', async () => {
    mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    let result;
    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).not.toHaveTextContent(/SpecialContacts/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/address-book/v1/digital-address');
  });

  it('renders Contacts (no contacts - only AppIO)', async () => {
    let result;
    await act(async () => {
      result = await render(<Contacts />, contactsAppIoOnly);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).not.toHaveTextContent(/SpecialContacts/i);
  });

  it('renders Contacts (legal contacts only)', async () => {
    let result;
    await act(async () => {
      result = await render(<Contacts />, contactsLegalOnly);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/LegalContactsList/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/SpecialContacts/i);
  });

  it('renders Contacts (courtesy contacts only - no AppIO)', async () => {
    let result;
    await act(async () => {
      result = await render(<Contacts />, contactsCourtesyOnly);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/SpecialContacts/i);
  });

  it('renders Contacts (courtesy contacts only - with AppIO)', async () => {
    let result;
    await act(async () => {
      result = await render(<Contacts />, contactsCourtesyOnlyWithAppIo);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/SpecialContacts/i);
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    let result;
    await act(async () => {
      result = await render(<Contacts />, contactsFull);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/LegalContactsList/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/SpecialContacts/i);
  });

  it('subtitle link properly redirects to profile page', async () => {
    mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    let result;
    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    const subtitleLink = result.getByText('subtitle-link-3');
    expect(subtitleLink).toBeInTheDocument();
    fireEvent.click(subtitleLink);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(PROFILO);
  });
});

describe('Contacts Page - different contact API behaviors', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('API error', async () => {
    mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 500);
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <Contacts />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <Contacts />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
