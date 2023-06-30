import React from 'react';
import {
  apiOutcomeTestHelper,
  AppResponseMessage,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

import { render, act, fireEvent, screen, mockApi } from '../../__test__/test-utils';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import { apiClient } from '../../api/apiClients';
import Contacts from '../Contacts.page';
import { PROFILO } from '../../navigation/routes.const';

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
jest.mock('../../component/Contacts/CourtesyContacts', () => () => <div>CourtesyContacts</div>);
jest.mock('../../component/Contacts/IOContact', () => () => <div>IOContact</div>);

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
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('renders Contacts (no contacts)', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    let result;
    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/address-book/v1/digital-address');
    mock.reset();
    mock.restore();
  });

  it('subtitle link properly redirects to profile page', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    let result;
    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    const subtitleLink = result.getByText('subtitle-link-3');
    expect(subtitleLink).toBeInTheDocument();
    fireEvent.click(subtitleLink);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(PROFILO);
    mock.reset();
    mock.restore();
  });
});

describe('Contacts Page - different contact API behaviors', () => {
  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
  });

  it('API error', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 500);
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
    mock.reset();
    mock.restore();
  });

  it('API OK', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
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
    mock.reset();
    mock.restore();
  });
});
