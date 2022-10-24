import { act, screen } from "@testing-library/react";

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

const mockNotFetchedTosState = {
  userState: {
    fetchedTos: false,
  }};

const mockNotAcceptedTosState = {
  userState: {
    fetchedTos: true,
    tos: false,
  }};

const mockAcceptedTosState = {
  userState: {
    fetchedTos: true,
    tos: true,
  }};

describe('Tests the ToSGuard component', () => {
  it('renders the loading page component if tos are not fetched', async () => {
    await act(async () => void render(<ToSGuard />, { preloadedState: mockNotFetchedTosState } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
  });

  it('renders the loading page component if tos are not accepted', async () => {
    await act(async () => void render(<ToSGuard />, { preloadedState: mockNotAcceptedTosState } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
  });

  it('renders the loading page component if tos are not fetched', async () => {
    await act(async () => void render(<ToSGuard />, { preloadedState: mockAcceptedTosState } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeTruthy();
  });
});