import { act, screen } from '@testing-library/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { render } from '../../__test__/test-utils';
import { AUTH_ACTIONS } from '../../redux/auth/actions';
import Router from '../routes';

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
  };
});

describe("router", () => {
  // expected behavior: it shows the ApiError component launched by OrganizationPartyGuard - see the code of ../routes.tsx
  it("error when retrieving Organization Party", async () => {
    const mockReduxState = {
      userState: { user: { sessionToken: 'good-token' } },
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_ORGANIZATION_PARTY),
    };
  
    await act(async () => void render(<Router />, { preloadedState: mockReduxState }));
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });
});
