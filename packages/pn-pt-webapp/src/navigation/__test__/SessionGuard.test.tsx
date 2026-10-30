import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { InstitutionType } from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import { RenderResult, act, render, screen, waitFor } from '../../__test__/test-utils';
import { authClient } from '../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../../api/auth/auth.routes';
import { getConfiguration } from '../../services/configuration.service';
import SessionGuard from '../SessionGuard';
import * as routes from '../routes.const';

const Guard = () => (
  <Routes>
    <Route element={<SessionGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('SessionGuard Component', () => {
  let mock: MockAdapter;
  let result: RenderResult;
  const mockOpenFn = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    vi.stubGlobal('open', mockOpenFn);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
  });

  it('no token - anonymous user', async () => {
    await act(async () => {
      render(<Guard />);
    });
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(
      `${getConfiguration().SELFCARE_BASE_URL}${routes.SELFCARE_LOGIN_PATH}`,
      '_self'
    );
    expect(mock.history.post).toHaveLength(0);
  });

  it('user logged in', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: '200_token' })
      .reply(200, userResponse);
    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=200_token' });
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(result.testStore.getState().userState.user.sessionToken).toBe(
        userResponse.sessionToken
      );
    });
    expect(screen.queryByText('Generic Page')).toBeInTheDocument();
  });

  it('exchange token error (403)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(403);
    await act(async () => {
      render(<Guard />, { route: '/#selfCareToken=403_token' });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(screen.queryByTestId('session-modal')).toBeInTheDocument();
    expect(screen.queryByText('leaving-app.title')).not.toBeInTheDocument();
  });

  it('exchange token error (451)', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(451);
    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=451_token' });
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.location.search).toBe('');
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  it('token-exchange user validation failed', async () => {
    mock
      .onPost(AUTH_TOKEN_EXCHANGE())
      .reply(200, { ...userResponse, fiscal_number: '@TSTUTN00A11A001P' });
    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=validation_error_token' });
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.location.search).toBe('?reason=user-validation-failed');
      expect(result.router.state.historyAction).toBe('REPLACE');
    });
  });

  it('token-exchange user not belonging to a PT institution', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, {
      ...userResponse,
      organization: { ...userResponse.organization, institutionType: InstitutionType.PA },
    });
    await act(async () => {
      result = render(<Guard />, { route: '/#selfCareToken=pa_token' });
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOT_ACCESSIBLE);
      expect(result.router.state.location.search).toBe('?reason=user-validation-failed');
    });
    expect(result.testStore.getState().userState.user.sessionToken).toBe('');
  });

  it('session expired', async () => {
    await act(async () => {
      render(<Guard />, {
        preloadedState: { userState: { user: { ...userResponse, desired_exp: 1 } } },
      });
    });
    expect(screen.queryByText('Generic Page')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('session-modal')).toBeInTheDocument();
      expect(screen.queryByText('leaving-app.title')).toBeInTheDocument();
    });
  });
});
