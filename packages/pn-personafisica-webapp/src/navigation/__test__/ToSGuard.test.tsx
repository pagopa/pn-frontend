import { ConsentUser } from "@pagopa-pn/pn-commons";
import { act, screen } from "@testing-library/react";
import React from "react";
import * as redux from "react-redux";

import { render } from "../../__test__/test-utils";
import ToSGuard from "../ToSGuard";

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

const paramsTosNotFetched = {
  fetchedTos: false,
  fetchedPrivacy: true,
  tosConsent: {
    accepted: false,
    isFirstAccept: false,
    consentVersion: 'mocked-version-1',
  },
  privacyConsent: {
    accepted: false,
    isFirstAccept: false,
    consentVersion: 'mocked-version-1',
  },
}

const paramsTosNotAccepted = {
  fetchedTos: true,
  fetchedPrivacy: true,
  tosConsent: {
    accepted: false,
    isFirstAccept: true,
    consentVersion: 'mocked-version-1',
  },
  privacyConsent: {
    accepted: false,
    isFirstAccept: true,
    consentVersion: 'mocked-version-1',
  },
}

const paramsPrivacyNotFetched = {
  fetchedTos: true,
  fetchedPrivacy: false,
  tosConsent: {
    accepted: false,
    isFirstAccept: false,
    consentVersion: 'mocked-version-1',
  },
  privacyConsent: {
    accepted: false,
    isFirstAccept: false,
    consentVersion: 'mocked-version-1',
  },
}

const paramsPrivacyNotAccepted = {
  fetchedTos: true,
  fetchedPrivacy: true,
  tosConsent: {
    accepted: true,
    isFirstAccept: true,
    consentVersion: 'mocked-version-1',
  },
  privacyConsent: {
    accepted: false,
    isFirstAccept: true,
    consentVersion: 'mocked-version-1',
  },
}

const mockTosState = (params: {fetchedTos: boolean, fetchedPrivacy: boolean, tosConsent: ConsentUser, privacyConsent: ConsentUser}) => ({
  userState: {
    user: {
      sessionToken: "mockedToken"
    },
    ...params
  }});

describe('Tests the ToSGuard component', () => {
  const mockDispatchFn = jest.fn();

  beforeEach(() => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading page component if tos are not fetched', async () => {
    await act(
      async () => void render(<ToSGuard />, { preloadedState: mockTosState(paramsTosNotFetched) })
    );

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('renders the loading page component if tos are not accepted', async () => {
    await act(
      async () => void render(<ToSGuard />, { preloadedState: mockTosState(paramsTosNotAccepted) })
    );

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('renders the loading page component if privacy are not fetched', async () => {
    await act(
      async () => void render(<ToSGuard />, { preloadedState: mockTosState(paramsPrivacyNotFetched) })
    );

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('renders the loading page component if privacy are not accepted', async () => {
    await act(
      async () => void render(<ToSGuard />, { preloadedState: mockTosState(paramsPrivacyNotAccepted) })
    );

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(2);
  });
});