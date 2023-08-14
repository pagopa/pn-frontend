import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { act, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentType } from '../../models/consents';
import ToSGuard from '../ToSGuard';

jest.mock('@pagopa-pn/pn-commons', () => ({
  __esModule: true,
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  LoadingPage: () => <div>loading page</div>,
}));

jest.mock('../../pages/ToSAcceptance.page', () => ({
  __esModule: true,
  ...jest.requireActual('../../pages/ToSAcceptance.page'),
  default: () => <div>tos acceptance page</div>,
}));

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
  };
});

const reduxState = {
  userState: {
    user: {
      sessionToken: 'mockedToken',
    },
    fetchedTos: false,
    fetchedPrivacy: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
  },
};

describe('Tests the ToSGuard component', () => {
  // eslint-disable-next-line functional/no-let
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

  it('renders the loading page component if tos and privacy are not fetched', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            200,
            {
              recipientId: 'mocked-recipientId',
              consentType: ConsentType.TOS,
              accepted: false,
            },
          ]);
        }, 2000);
      });
    });
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            200,
            {
              recipientId: 'mocked-recipientId',
              consentType: ConsentType.DATAPRIVACY,
              accepted: false,
            },
          ]);
        }, 2000);
      });
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the loading page component if tos are not fetched', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: false,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            200,
            {
              recipientId: 'mocked-recipientId',
              consentType: ConsentType.TOS,
              accepted: false,
            },
          ]);
        }, 2000);
      });
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the loading page component if privacy are not fetched', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
    });
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            200,
            {
              recipientId: 'mocked-recipientId',
              consentType: ConsentType.DATAPRIVACY,
              accepted: false,
            },
          ]);
        }, 2000);
      });
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the tos page component if privacy are not accepted', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: false,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the tos page component if tos are not accepted', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the generic page component if tos and privacy are accepted', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
    });
    await act(async () => void render(<ToSGuard />, { preloadedState: reduxState }));
    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeTruthy();
    expect(mock.history.get).toHaveLength(2);
  });
});
