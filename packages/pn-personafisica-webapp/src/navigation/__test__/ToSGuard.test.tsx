import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentType } from '../../models/consents';
import ToSGuard from '../ToSGuard';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const reduxState = {
  userState: {
    user: userResponse,
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

const Guard = () => (
  <Routes>
    <Route path="/" element={<ToSGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('Tests the ToSGuard component', () => {
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

  it('renders the loading page component if tos are not fetched', async () => {
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
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
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeTruthy();
    expect(mock.history.get).toHaveLength(2);
  });
});
