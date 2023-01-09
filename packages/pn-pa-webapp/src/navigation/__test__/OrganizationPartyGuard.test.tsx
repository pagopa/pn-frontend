import { act, screen } from '@testing-library/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { render } from '../../__test__/test-utils';
import OrganizationPartyGuard from '../OrganizationPartyGuard';
import { AUTH_ACTIONS } from '../../redux/auth/actions';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div data-testid="normal-contents">Generic Page</div>,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe("OrganizationPartyGuard component", () => {
  it('no API error in call for organization party data - shows the content', async () => {
    const mockReduxState = {
      userState: { user: { 
        sessionToken: 'mocked-token',
        organization: { id: "good-organization-id" },
      } },
    };
    await act(async () => void render(<OrganizationPartyGuard />, { preloadedState: mockReduxState }));
    const contentsComponent = screen.queryByTestId("normal-contents"); 
    const apiErrorComponent = screen.queryByTestId("api-error"); 
    expect(contentsComponent).toBeInTheDocument();
    expect(apiErrorComponent).not.toBeInTheDocument();
  });

  it('API error in call for organization party data - shows ApiError component', async () => {
    const mockReduxState = {
      userState: { user: { 
        sessionToken: 'mocked-token',
        organization: { id: "bad-organization-id" },
      } },
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY),
    };
    await act(async () => void render(<OrganizationPartyGuard />, { preloadedState: mockReduxState }));
    const contentsComponent = screen.queryByTestId("normal-contents"); 
    const apiErrorComponent = screen.queryByTestId(`api-error-${AUTH_ACTIONS.GET_ORGANIZATION_PARTY}`); 
    expect(contentsComponent).not.toBeInTheDocument();
    expect(apiErrorComponent).toBeInTheDocument();
  });
});
