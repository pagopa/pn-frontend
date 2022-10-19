import { MemoryRouter } from 'react-router-dom';
import { act, screen } from '@testing-library/react';
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


describe("router", () => {
  beforeEach(() => {
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
