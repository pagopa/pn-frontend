import { act, screen } from "@testing-library/react";
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

const mockTosState = (fetchedTos: boolean, tos: boolean) => ({
  userState: {
    user: {
      sessionToken: "mockedToken"
    },
    fetchedTos,
    tos
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
    await act(async () => void render(<ToSGuard />, { preloadedState: mockTosState(false, false) } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the loading page component if tos are not accepted', async () => {
    await act(async () => void render(<ToSGuard />, { preloadedState: mockTosState(true, false) } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the loading page component if tos are not fetched', async () => {
    await act(async () => void render(<ToSGuard />, { preloadedState: mockTosState(true, true) } ));

    const pageComponent = screen.queryByText('loading page');
    const tosComponent = screen.queryByText('tos acceptance page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeTruthy();
    expect(mockDispatchFn).toBeCalledTimes(1);
  });
});