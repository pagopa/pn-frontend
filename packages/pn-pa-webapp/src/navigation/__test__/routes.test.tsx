import { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { render, renderWithoutRouter } from '../../__test__/test-utils';
import { AUTH_ACTIONS } from '../../redux/auth/actions';
import Router from '../routes';
import { PNRole } from '../../models/user';

const mockSessionCheckFn = jest.fn(() => { });

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useSessionCheck: () => mockSessionCheckFn,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
    TermsOfServiceHandler: () => <div data-testid="mock-tos-handler">Terms of Service handler</div>,
  };
});

/* eslint-disable functional/no-let */
let mockTosValue: boolean;

jest.mock('../../api/consents/Consents.api', () => {
  const original = jest.requireActual('../../api/consents/Consents.api');
  return {
    ...original,
    ConsentsApi: {
      getConsentByType: () => Promise.resolve({
            recipientId: "mock-consent-id",
            consentType: "TOS",
            consentVersion: "V001",
            accepted: mockTosValue,
          })
    },
  };
});

jest.mock('../../pages/Dashboard.page', () => 
  () => <div data-testid="mock-dashboard">Dashboard</div>
);


const FakeComponent = () => {
  const [status, setStatus] = useState("Closed");

  return <>
    <div data-testid="statusDisplay">{status}</div>
    <button data-testid="changeStatus" onClick={() => setStatus("Open")}>Change status</button>
  </>;
};

const FakeRouter = () => {
  // const navigate = useNavigate();
  const location = useLocation();
   
  useEffect(() => {
    console.log("in FakeRouter");
    console.log({href: window.location.href, toString: window.location.toString(), host: window.location.host, pathname: window.location.pathname });
    console.log(location);
    // if (location.pathname === "/") {
    //   navigate("/a");
    // }
  }, []);
  
  return <>
    <div data-testid="title">The title</div>;
    
    <Routes>
      <Route path="/a" element={<div data-testid="route-a">Route A</div>} />
      <Route path="/b" element={<div data-testid="route-b">Route B</div>} />
      <Route path="*" element={<div data-testid="route-not-found">Not found</div>} />
    </Routes>
  </>;
}

describe("router", () => {
  beforeEach(() => {
    // mockLocationPathname = "/";
    mockTosValue = true;
  });

  // expected behavior: it shows the ApiError component launched by OrganizationPartyGuard - see the code of ../routes.tsx
  it("error when retrieving Organization Party", async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'good-token' } },
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY),
    };
  
    await act(async () => void render(<Router />, { preloadedState: mockReduxState }));
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it.skip("interaction example", async () => {
    await act(async () => void render(<FakeComponent />));
    const statusDisplayComponent = screen.getByTestId("statusDisplay"); 
    const statusChangeButton = screen.getByTestId("changeStatus");  
    expect(statusDisplayComponent).toHaveTextContent("Closed");
    fireEvent.click(statusChangeButton);
    expect(statusDisplayComponent).toHaveTextContent("Open");
  });

  it.skip("router example - doesn't work this way", async () => {
    // mockLocationPathname = "/a";
    // window.location = {...window.location, pathname: "/a"};
    // window.location.assign("http://localhost/a");
    // console.log("in test");
    console.log({href: window.location.href, toString: window.location.toString(), host: window.location.host, pathname: window.location.pathname });
    await act(async () => void render(<FakeRouter />));
    const routeAComponent = screen.queryByTestId("route-a"); 
    const routeBComponent = screen.queryByTestId("route-b"); 
    expect(routeAComponent).toBeInTheDocument();
    expect(routeBComponent).not.toBeInTheDocument();
  });

  it.skip("router example - attempt using MemoryRouter", async () => {
    await act(async () => void renderWithoutRouter(<MemoryRouter initialEntries={["/a"]}><FakeRouter /></MemoryRouter>));
    const routeAComponent = screen.queryByTestId("route-a"); 
    const routeBComponent = screen.queryByTestId("route-b"); 
    expect(routeAComponent).toBeInTheDocument();
    expect(routeBComponent).not.toBeInTheDocument();
  });

  // expected behavior: to be redirected automatically to /dashboard
  it("access to /tos for a user which have accepted the ToS", async () => {
    const mockReduxState = { userState: { user: { 
      sessionToken: 'good-token', 
      organization: { id: 'good-organization', roles: [{ role: PNRole.ADMIN }] } 
    }}};
    await act(async () => void renderWithoutRouter(
      <MemoryRouter initialEntries={["/tos"]}><Router /></MemoryRouter>, { preloadedState: mockReduxState }
    ));
    expect(screen.queryByTestId("mock-tos-handler")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-dashboard")).toBeInTheDocument();
  });

  // expected behavior: to keep in /tos
  it("access to /tos for a user which have not accepted the ToS", async () => {
    mockTosValue = false;
    const mockReduxState = { userState: { user: { 
      sessionToken: 'good-token', 
      organization: { id: 'good-organization', roles: [{ role: PNRole.ADMIN }] } 
    }}};
    await act(async () => void renderWithoutRouter(
      <MemoryRouter initialEntries={["/tos"]}><Router /></MemoryRouter>, { preloadedState: mockReduxState }
    ));
    expect(screen.queryByTestId("mock-tos-handler")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-dashboard")).not.toBeInTheDocument();
  });
});
