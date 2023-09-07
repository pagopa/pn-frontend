import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  apiOutcomeTestHelper,
} from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import Contacts from '../Contacts.page';

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
  let result: RenderResult;

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
    mock.onGet(CONTACTS_LIST()).reply(200, []);

    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/address-book/v1/digital-address');
  });

  it('subtitle link properly redirects to profile page', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = await render(<Contacts />, initialState);
    });
    const subtitleLink = result.getByText('subtitle-link');
    const spyWindowOpen = jest.spyOn(window, 'open');
    spyWindowOpen.mockImplementation(jest.fn());
    expect(subtitleLink).toBeInTheDocument();
    fireEvent.click(subtitleLink);
    expect(spyWindowOpen).toHaveBeenCalledTimes(1);
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
    apiOutcomeTestHelper.clearMock();
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it('API error', async () => {
    mock.onGet(CONTACTS_LIST()).reply(500, []);
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
    mock.onGet(CONTACTS_LIST()).reply(200, []);
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
